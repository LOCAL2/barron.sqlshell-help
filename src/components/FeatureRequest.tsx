import { useState } from 'react';
import { Send, Plus, Bug } from 'lucide-react';

interface FeatureRequestProps {
  type?: 'feature' | 'bug';
}

export default function FeatureRequest({ type = 'feature' }: FeatureRequestProps) {
  const [formData, setFormData] = useState({
    type: type,
    title: '',
    description: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would normally send this to your backend
    console.log('Form submitted:', formData);
    alert('ขอบคุณสำหรับข้อเสนอแนะ/แจ้งบั๊ก! เราจะตรวจสอบและดำเนินการโดยเร็ว');
    setFormData({
      type: 'feature',
      title: '',
      description: '',
      email: ''
    });
  };

  return (
    <div className="feature-request">
      <div className="feature-form">
        <h2>เสนอคำสั่งใหม่ / แจ้งบั๊ก</h2>
        
        <div className="request-type-selector">
          <button 
            className={`type-btn ${formData.type === 'feature' ? 'active' : ''}`}
            onClick={() => setFormData({...formData, type: 'feature'})}
          >
            <Plus size={16} />
            เสนอคำสั่งใหม่
          </button>
          <button 
            className={`type-btn ${formData.type === 'bug' ? 'active' : ''}`}
            onClick={() => setFormData({...formData, type: 'bug'})}
          >
            <Bug size={16} />
            แจ้งบั๊ก
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>หัวข้อ *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder={formData.type === 'feature' ? 'เช่น: เพิ่มคำสั่ง JOIN' : 'เช่น: ปัญหาการคัดลอกโค้ด'}
              required
            />
          </div>

          <div className="form-group">
            <label>รายละเอียด *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder={formData.type === 'feature' 
                ? 'อธิบายคำสั่งที่ต้องการเพิ่มและวิธีการใช้งาน...' 
                : 'อธิบายปัญหาที่พบและวิธีการทำซ้ำ...'
              }
              rows={6}
              required
            />
          </div>

          <div className="form-group">
            <label>อีเมล (สำหรับติดต่อกลับ)</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="your@email.com"
            />
          </div>

          <button type="submit" className="submit-btn">
            <Send size={16} />
            ส่งข้อเสนอแนะ
          </button>
        </form>
      </div>
    </div>
  );
}
