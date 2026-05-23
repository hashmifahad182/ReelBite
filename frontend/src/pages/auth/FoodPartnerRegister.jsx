import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth-shared.css';
import api from '../../api/axios'
import { useNavigate } from 'react-router-dom';

const FoodPartnerRegister = () => {

  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  
  const handleSubmit = async (e) => { 
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const businessName = e.target.businessName.value;
    const contactName = e.target.contactName.value;
    const phone = e.target.phone.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const address = e.target.address.value;

    try {
      const payload = {
        name:businessName,
        contactName,
        phone,
        email,
        password,
        address
      }
      if (imageUrl) payload.image = imageUrl

      const response = await api.post("/api/auth/food-partner/register", payload, { withCredentials: true });

      console.log(response.data);
      setSuccess('Registration successful! Waiting for admin approval. You will be able to login once approved.');
      setTimeout(() => {
        navigate("/food-partner/login");
      }, 2000);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      console.error("There was an error registering!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" role="region" aria-labelledby="partner-register-title">
        <header>
          <h1 id="partner-register-title" className="auth-title">Partner sign up</h1>
          <p className="auth-subtitle">Grow your business with our platform.</p>
        </header>
        <nav className="auth-alt-action" style={{marginTop: '-4px'}}>
          <strong style={{fontWeight:600}}>Switch:</strong> <Link to="/user/register">User</Link> • <Link to="/food-partner/register">Food partner</Link>
        </nav>
        {error && <div className="error-message">{error}</div>}
        {success && <div style={{background: '#d1fae5', color: '#065f46', border: '1px solid #6ee7b7', padding: 'var(--space-3) var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', textAlign: 'center'}}>{success}</div>}
        <div style={{marginBottom: '12px'}}>
          <label style={{display: 'block', marginBottom: 8}}>Business logo (optional)</label>
          <input type="file" accept="image/*" onChange={async (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            setLoading(true);
            setError('');
            try {
              const form = new FormData();
              form.append('file', file);
              const uploadRes = await api.post('/api/upload/temp', form, { headers: {'Content-Type': 'multipart/form-data'} });
              setImageUrl(uploadRes.data.url);
            } catch (err) {
              setError('Image upload failed. Try again or skip.');
            } finally {
              setLoading(false);
            }
          }} />
          {imageUrl && <div style={{marginTop:8}}>Preview: <img src={imageUrl} alt="preview" style={{height:60,borderRadius:8,display:'block',marginTop:8}}/></div>}
        </div>
        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="businessName">Business Name</label>
            <input id="businessName" name="businessName" placeholder="Tasty Bites" autoComplete="organization" />
          </div>
          <div className="two-col">
            <div className="field-group">
              <label htmlFor="contactName">Contact Name</label>
              <input id="contactName" name="contactName" placeholder="Jane Doe" autoComplete="name" />
            </div>
            <div className="field-group">
              <label htmlFor="phone">Phone</label>
              <input id="phone" name="phone" placeholder="+1 555 123 4567" autoComplete="tel" />
            </div>
          </div>
            <div className="field-group">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" placeholder="business@example.com" autoComplete="email" />
            </div>
          <div className="field-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" type="password" placeholder="Create password" autoComplete="new-password" />
          </div>
          <div className="field-group">
            <label htmlFor="address">Address</label>
            <input id="address" name="address" placeholder="123 Market Street" autoComplete="street-address" />
            <p className="small-note">Full address helps customers find you faster.</p>
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Partner Account'}
          </button>
        </form>
        <div className="auth-alt-action">
          Already a partner? <Link to="/food-partner/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;