import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Send, Plus, Bug, CheckCircle, AlertCircle, Clock, Star } from 'lucide-react';

interface ProfessionalFeatureRequestProps {
  type?: 'feature' | 'bug';
}

export default function ProfessionalFeatureRequest({ type = 'feature' }: ProfessionalFeatureRequestProps) {
  const [formData, setFormData] = useState({
    type: type,
    title: '',
    description: '',
    email: '',
    priority: 'medium'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Send to Discord webhook
      const webhookUrl = import.meta.env.VITE_DISCORD_WEBHOOK_URL;
      
      if (!webhookUrl) {
        throw new Error('Discord webhook URL not configured');
      }
      
      const discordPayload = {
        embeds: [{
          title: formData.type === 'feature' ? '🚀 เสนอคำสั่งใหม่' : '🐛 แจ้งปัญหา',
          color: formData.type === 'feature' ? 5814783 : 15548997, // Blue for feature, Red for bug
          fields: [
            {
              name: '📝 หัวข้อ',
              value: formData.title,
              inline: false
            },
            {
              name: '🎯 ความสำคัญ',
              value: formData.priority === 'low' ? '🟢 ต่ำ' : formData.priority === 'medium' ? '🟡 ปานกลาง' : '🔴 สูง',
              inline: true
            },
            {
              name: '📧 อีเมล',
              value: formData.email || 'ไม่ระบุ',
              inline: true
            },
            {
              name: '📋 รายละเอียด',
              value: formData.description,
              inline: false
            }
          ],
          footer: {
            text: `MySQL Shell Command Generator • ${new Date().toLocaleString('th-TH')}`
          }
        }]
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload),
      });

      if (!response.ok) {
        throw new Error('Failed to send to Discord');
      }

      console.log('Successfully sent to Discord');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error sending to Discord:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="professional-feature-request">
        <div className="success-container">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h2>ส่งข้อเสนอแนะเรียบร้อย!</h2>
          <p>ขอบคุณสำหรับข้อเสนอแนะของคุณ เราจะตรวจสอบและดำเนินการโดยเร็ว</p>
          <Link to="/" className="back-btn">
            <ArrowLeft size={16} />
            กลับไปหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="professional-feature-request">
      <div className="request-header">
        <Link to="/" className="back-link">
          <ArrowLeft size={20} />
          กลับไปหน้าหลัก
        </Link>
        
        <div className="feature-header-content">
          <div className="header-icon">
            {type === 'feature' ? <Plus size={32} /> : <Bug size={32} />}
          </div>
          <div className="header-text">
            <h1>{type === 'feature' ? 'เสนอคำสั่งใหม่' : 'แจ้งปัญหา'}</h1>
            <p>{type === 'feature' 
              ? 'ช่วยพัฒนา MySQL Shell Command Generator ให้ดีขึ้น' 
              : 'แจ้งปัญหาที่พบเพื่อให้เราแก้ไข'
            }</p>
          </div>
        </div>
      </div>

      <div className="request-content">
        <div className="form-container">
          <form onSubmit={handleSubmit} className="professional-form">
            <div className="form-section">
              <h3>
                {type === 'feature' ? <Plus size={18} /> : <Bug size={18} />}
                ข้อมูลหลัก
              </h3>
              
              <div className="form-group">
                <label>หัวข้อ *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={type === 'feature' ? 'เช่น: เพิ่มคำสั่ง JOIN แบบต่างๆ' : 'เช่น: ปัญหาการคัดลอกโค้ดบน Firefox'}
                  required
                />
              </div>

              <div className="form-group">
                <label>ความสำคัญ</label>
                <div className="priority-selector">
                  {['low', 'medium', 'high'].map((priority) => (
                    <button
                      key={priority}
                      type="button"
                      className={`priority-btn ${formData.priority === priority ? 'active' : ''}`}
                      onClick={() => setFormData({...formData, priority})}
                    >
                      <Star size={14} />
                      {priority === 'low' ? 'ต่ำ' : priority === 'medium' ? 'ปานกลาง' : 'สูง'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>
                <AlertCircle size={18} />
                รายละเอียด
              </h3>
              
              <div className="form-group">
                <label>รายละเอียด *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder={type === 'feature' 
                    ? '• อธิบายคำสั่งที่ต้องการเพิ่ม\n• วิธีการใช้งานที่คาดหวัง\n• ประโยชน์ที่จะได้รับ' 
                    : '• อธิบายปัญหาที่พบ\n• วิธีการทำซ้ำปัญหา\n• ผลกระทบที่เกิดขึ้น'
                  }
                  rows={8}
                  required
                />
              </div>
            </div>

            <div className="form-section">
              <h3>
                <Clock size={18} />
                ข้อมูลติดต่อ (ไม่จำเป็น)
              </h3>
              
              <div className="form-group">
                <label>อีเมล</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-btn-professional"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <div className="spinner"></div>
                  กำลังส่ง...
                </>
              ) : (
                <>
                  <Send size={18} />
                  ส่งข้อเสนอแนะ
                </>
              )}
            </button>
          </form>
        </div>

        <div className="info-sidebar">
          <div className="info-card">
            <h3>
              {type === 'feature' ? <Plus size={16} /> : <Bug size={16} />}
              {type === 'feature' ? 'คำแนะนำในการเสนอ' : 'คำแนะนำในการแจ้งปัญหา'}
            </h3>
            <ul>
              {type === 'feature' ? (
                <>
                  <li>อธิบายคำสั่งที่ต้องการอย่างชัดเจน</li>
                  <li>ระบุวิธีการใช้งานที่คาดหวัง</li>
                  <li>แนบตัวอย่าง SQL ที่ต้องการ</li>
                  <li>อธิบายประโยชน์ที่จะได้รับ</li>
                </>
              ) : (
                <>
                  <li>อธิบายปัญหาอย่างละเอียด</li>
                  <li>ระบุขั้นตอนการทำซ้ำปัญหา</li>
                  <li>บอก browser และ OS ที่ใช้</li>
                  <li>แนบ screenshot ถ้าจำเป็น</li>
                </>
              )}
            </ul>
          </div>

          <div className="info-card">
            <h3>
              <Clock size={16} />
              ระยะเวลาดำเนินการ
            </h3>
            <p>เราจะตรวจสอบข้อเสนอแนะของคุณภายใน 24-48 ชั่วโมง</p>
          </div>
        </div>
      </div>
    </div>
  );
}
