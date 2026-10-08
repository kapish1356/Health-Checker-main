import { db } from '../models/db.js';

export const getMedicines = (req, res) => {
  const { search = '', category = '' } = req.query;
  let list = [...(db.data.medicines || [])];

  if (search.trim()) {
    const q = search.toLowerCase();
    list = list.filter(m => 
      m.brandName.toLowerCase().includes(q) ||
      m.genericName.toLowerCase().includes(q) ||
      m.intendedUses.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    list = list.filter(m => m.category.toLowerCase().includes(category.toLowerCase()));
  }

  return res.json({
    success: true,
    total: list.length,
    medicines: list
  });
};

export const getMedicineById = (req, res) => {
  const { id } = req.params;
  const med = (db.data.medicines || []).find(m => m.id === id);
  if (!med) {
    return res.status(404).json({ success: false, message: 'Medicine not found.' });
  }
  return res.json({ success: true, medicine: med });
};
