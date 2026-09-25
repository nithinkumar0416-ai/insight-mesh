import { parseDocumentContent } from '../utils/pdfParser.js';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';
import { localStore } from '../utils/store.js';

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Please select a PDF or TXT document to upload.' });
    }

    const title = req.body.title || req.file.originalname;
    const userId = req.user.id;
    
    // Parse PDF/TXT file buffer into text and structured paragraphs
    const parsed = await parseDocumentContent(req.file.buffer, req.file.mimetype, req.file.originalname);

    if (isSupabaseConfigured) {
      const { data: doc, error } = await supabase
        .from('documents')
        .insert([{
          user_id: userId,
          title,
          file_path: `uploads/${req.file.originalname}`,
          extracted_text: parsed.rawText
        }])
        .select()
        .single();

      if (error) throw error;

      return res.status(201).json({
        message: 'Document uploaded and parsed successfully',
        document: {
          ...doc,
          wordCount: parsed.wordCount,
          paragraphCount: parsed.paragraphs.length,
          paragraphs: parsed.paragraphs
        }
      });
    } else {
      const doc = localStore.createDocument({
        user_id: userId,
        title,
        file_path: `uploads/${req.file.originalname}`,
        extracted_text: parsed.rawText
      });

      return res.status(201).json({
        message: 'Document uploaded and parsed successfully',
        document: {
          ...doc,
          wordCount: parsed.wordCount,
          paragraphCount: parsed.paragraphs.length,
          paragraphs: parsed.paragraphs
        }
      });
    }
  } catch (error) {
    console.error('Document Upload Error:', error);
    return res.status(500).json({ error: 'Failed to upload and parse document.' });
  }
};

export const getDocuments = async (req, res) => {
  try {
    const userId = req.user.id;

    if (isSupabaseConfigured) {
      const { data: documents, error } = await supabase
        .from('documents')
        .select('*, insights(id)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formatted = documents.map(d => ({
        ...d,
        has_insight: Boolean(d.insights && d.insights.length > 0)
      }));

      return res.status(200).json({ documents: formatted });
    } else {
      const documents = localStore.getDocumentsByUser(userId);
      return res.status(200).json({ documents });
    }
  } catch (error) {
    console.error('Get Documents Error:', error);
    return res.status(500).json({ error: 'Failed to fetch uploaded documents.' });
  }
};

export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { data: doc, error } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !doc) {
        return res.status(404).json({ error: 'Document not found.' });
      }

      const parsed = await parseDocumentContent(Buffer.from(doc.extracted_text || ''), 'text/plain', doc.title);
      const { data: insight } = await supabase
        .from('insights')
        .select('*')
        .eq('document_id', id)
        .single();

      return res.status(200).json({
        document: doc,
        paragraphs: parsed.paragraphs,
        insight: insight || null
      });
    } else {
      const doc = localStore.getDocumentById(id);
      if (!doc) {
        return res.status(404).json({ error: 'Document not found.' });
      }

      const parsed = await parseDocumentContent(Buffer.from(doc.extracted_text || ''), 'text/plain', doc.title);
      const insight = localStore.getInsightByDocumentId(id);

      return res.status(200).json({
        document: doc,
        paragraphs: parsed.paragraphs,
        insight: insight || null
      });
    }
  } catch (error) {
    console.error('Get Document Detail Error:', error);
    return res.status(500).json({ error: 'Failed to retrieve document details.' });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;

    if (isSupabaseConfigured) {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Document deleted successfully.' });
    } else {
      localStore.deleteDocument(id);
      return res.status(200).json({ message: 'Document deleted successfully.' });
    }
  } catch (error) {
    console.error('Delete Document Error:', error);
    return res.status(500).json({ error: 'Failed to delete document.' });
  }
};
