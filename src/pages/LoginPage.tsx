import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface InputFieldProps {
  label: string;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const InputField: React.FC<InputFieldProps> = ({ label, placeholder, type = 'text', value, onChange }) => {
  return (
    <div className="flex flex-col mt-6">
      <label className="text-lg font-semibold text-gray-800">{label}</label>
      <input
        type={type}
        className="mt-2 px-4 py-2 text-base font-light rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-#4A90E2"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('http://localhost:8085/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login successful:', data);
      localStorage.setItem('access_token', data.access_token);
      navigate('/Main');
    } else {
      console.error('Login failed');
      setError('아이디 또는 비밀번호를 잘못 입력했거나 존재하지 않는 계정입니다.');
    }
  };

  return (
    <main className="flex flex-col justify-center items-center px-8 py-12 font-bold text-gray-900 bg-gray-50 h-screen">
      <div className="flex flex-col mt-20 w-full max-w-md">
        <h1 className="text-3xl text-center text-gray-800">로그인</h1>
        <form onSubmit={handleSubmit} className="w-full mt-6">
          <InputField
            label="아이디"
            placeholder="아이디를 입력해주세요."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="비밀번호"
            placeholder="비밀번호를 입력해주세요."
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <div className="mt-2 text-center text-red-400">
              {error}
            </div>
          )}
          <div className="flex justify-center w-full mt-6">
            <button
              type="submit"
              className="px-8 py-3 text-lg text-center text-white bg-[#4A90E2] rounded-lg hover:bg-[#3A7DC1] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              로그인
            </button>
          </div>
          <div className="flex justify-center w-full mt-4">
            <Link to="/register">
              <button
                type="button"
                className="px-8 py-3 text-lg text-center text-[#4A90E2]"
              >
                회원가입
              </button>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default LoginPage;
