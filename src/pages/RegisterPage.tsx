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
        className="mt-2 px-4 py-2 text-base font-light rounded-lg bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

const RegisterPage: React.FC = () => {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // useNavigate 훅을 사용합니다.

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      const response = await fetch('http://www.gaemoim.site/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: nickname,
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error('Request failed');
      }

      const data = await response.json();
      console.log(data);
      navigate('/'); // 회원가입 성공 후 로그인 페이지로 리디렉션합니다.
    } catch (error) {
      console.error('Registration failed:', error);
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <main className="flex flex-col justify-center items-center px-8 py-12 font-bold text-gray-900 bg-gray-50 h-screen">
      <div className="flex flex-col mt-20 w-full max-w-md">
        <h1 className="text-3xl text-center text-gray-800">회원가입</h1>
        <form className="w-full mt-6" onSubmit={handleSubmit}>
          <InputField
            label="닉네임"
            placeholder="닉네임을 입력해주세요."
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
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
          <InputField
            label="비밀번호 확인"
            placeholder="비밀번호를 한번 더 입력해주세요."
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {error && <p className="mt-1 text-red-400">{error}</p>}
          <div className="flex justify-center w-full mt-6">
            <button
              type="submit"
              className="px-8 py-3 text-lg text-center text-white bg-[#4A90E2] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              계정 생성
            </button>
          </div>
          <div className="flex justify-center w-full mt-4">
            <Link to="/">
              <span className="text-lg text-[#4A90E2] cursor-pointer hover:underline">
                로그인
              </span>
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;
