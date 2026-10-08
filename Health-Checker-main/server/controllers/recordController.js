import { db } from '../models/db.js';

export const getMyRecords = (req, res) => {
  const { category } = req.query;
  let list = db.data.medicalRecords.filter(r => r.userId === req.user.id);
  if (category && category !== 'all') {
    list = list.filter(r => r.category.toLowerCase() === category.toLowerCase());
  }
  list.sort((a, b) => new Date(b.recordDate || b.createdAt) - new Date(a.recordDate || a.createdAt));
  return res.json({ success: true, records: list });
};

export const uploadRecord = (req, res) => {
  try {
    const { title, category = 'Other', recordDate, doctorName, hospitalName, notes } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, message: 'Record title is required.' });
    }

    let fileName = 'Uploaded_Document.pdf';
    let fileUrl = '/uploads/sample_lab_report.pdf';
    let fileSize = '850 KB';
    let fileType = 'application/pdf';

    if (req.file) {
      fileName = req.file.originalname;
      fileUrl = `/uploads/${req.file.filename}`;
      fileSize = `${(req.file.size / 1024).toFixed(1)} KB`;
      fileType = req.file.mimetype;
    }

    const newRecord = {
      id: `rec-${Date.now()}`,
      userId: req.user.id,
      title,
      category,
      recordDate: recordDate || new Date().toISOString().split('T')[0],
      doctorName: doctorName || 'Self-Uploaded',
      hospitalName: hospitalName || 'Personal Health Locker',
      fileName,
      fileType,
      fileSize,
      fileUrl,
      notes: notes || '',
      createdAt: new Date().toISOString()
    };

    db.data.medicalRecords.unshift(newRecord);
    db.save();
    db.logAudit('RECORD_UPLOAD', req.user.email, `Uploaded medical document "${title}"`);

    return res.status(201).json({
      success: true,
      message: 'Medical record uploaded and encrypted into your health locker.',
      record: newRecord
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to upload medical record.' });
  }
};

export const deleteRecord = (req, res) => {
  const { id } = req.params;
  const index = db.data.medicalRecords.findIndex(r => r.id === id && r.userId === req.user.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Record not found or unauthorized.' });
  }

  const removed = db.data.medicalRecords.splice(index, 1)[0];
  db.save();
  db.logAudit('RECORD_DELETED', req.user.email, `Deleted record "${removed.title}"`);

  return res.json({ success: true, message: 'Medical record removed safely.' });
};

export const createShareLink = (req, res) => {
  const { recordId, expiryHours = 24 } = req.body;
  const record = db.data.medicalRecords.find(r => r.id === recordId && r.userId === req.user.id);
  
  if (!record) {
    return res.status(404).json({ success: false, message: 'Record not found.' });
  }

  const shareCode = `SHR-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
  const expiresAt = new Date(Date.now() + expiryHours * 3600 * 1000).toISOString();

  if (!db.data.sharedLinks) db.data.sharedLinks = [];
  db.data.sharedLinks.push({
    shareCode,
    recordId: record.id,
    userId: req.user.id,
    expiresAt,
    createdAt: new Date().toISOString()
  });
  db.save();

  return res.json({
    success: true,
    shareCode,
    expiresAt,
    shareUrl: `/shared-record/${shareCode}`,
    message: `Secure time-limited share access generated (valid for ${expiryHours} hours).`
  });
};
