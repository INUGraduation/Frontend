import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProfileImage from '../assets/images/Profile.svg'; // 변경: Profile -> ProfileImage

interface NavItem {
  href: string;
  text: string;
}

const navItems: NavItem[] = [
  { href: '/MyUserEdit', text: '프로필' },
  { href: '/MyPaste', text: '내가 쓴 글' },
  { href: '/MyRecruitment', text: '내가 신청한 글' },
];

interface ProfileData {
  id: number;
  photo: string;
  gender: string;
  intro: string;
  residence: string;
  status: string;
  positions: string[];
  techStacks: string[];
}

const techStackOptions = [
  'Spring', 'Nodejs', 'Django', 'Flask', 'Ruby', 'php', 'Go', 
  'MySQL', 'MongoDB', 'JavaScript', 'TypeScript', 'React', 'Vue', 
  'Svelte', 'Nextjs', 'Flutter', 'Swift', 'Kotlin', 'ReactNative', 
  'Unity', 'AWS', 'Docker', 'Kubernetes', 'Figma', 'Git'
];

const positionOptions = [
  'backend', 'frontend', 'mobile'
];

const Nav: React.FC<{ items: NavItem[] }> = ({ items }) => (
  <nav className="flex flex-col grow items-start pt-16 pr-20 pb-11 pl-7 w-full text-xl text-black bg-[#E6F0FA] max-md:px-5 max-md:mt-10">
    <h2 className="ml-5 text-4xl font-extrabold uppercase text max-md:ml-2.5">마이페이지</h2>
    {items.map((item, index) => (
      <Link
        key={index}
        to={item.href}
        className={`mt-16 ml-7 uppercase text max-md:mt-10 max-md:ml-2.5 ${item.text === '프로필' ? 'font-extrabold' : 'font-medium'}`}
      >
        {item.text}
      </Link>
    ))}
  </nav>
);

const UserProfile: React.FC = () => { // 변경: Profile -> UserProfile
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const response = await fetch(`http://www.gaemoim.site/api/v1/profiles/me`, { headers });
        const data: ProfileData = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!profileData) return;

    const token = localStorage.getItem('access_token');
    const headers = {
      'Authorization': `Bearer ${token}`
    };

    const formData = new FormData();
    if (photo) {
      formData.append('photo', photo);
    }
    const profileUpdateDto = {
      gender: profileData.gender,
      intro: profileData.intro,
      residence: profileData.residence,
      status: profileData.status,
      positions: profileData.positions,
      techStacks: profileData.techStacks,
    };
    formData.append('profile', new Blob([JSON.stringify(profileUpdateDto)], { type: 'application/json' }));

    try {
      await axios.put(`http://www.gaemoim.site/api/v1/profiles/${profileData.id}`, formData, { headers });
      alert('프로필 수정 완료!');
      setIsEditMode(false); // 업데이트 후 조회 모드로 전환
      navigate('/MyUserEdit');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'techStacks' || name === 'positions') {
      const options = e.target.options;
      const selectedValues: string[] = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setProfileData(prevData => prevData ? { ...prevData, [name]: selectedValues } : null);
    } else {
      setProfileData(prevData => prevData ? { ...prevData, [name]: value } : null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhoto(e.target.files[0]);
    }
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col self-stretch px-4 my-auto text-3xl font-extrabold text-black max-md:mt-8 max-md:max-w-full">
      <h1 className="text-4xl text-[#4A90E2] max-md:max-w-full max-md:text-3xl">프로필</h1>
      {isEditMode ? (
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mt-6">
            <img src={profileData.photo ? profileData.photo : ProfileImage} alt="Profile" className="rounded-full w-24 h-24" /> {/* 변경: Profile -> ProfileImage */}
            <input type="file" onChange={handleFileChange} className="mt-4" />
          </div>
          <h2 className="mt-16 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">분야</h2>
          <select name="positions" multiple value={profileData.positions} onChange={handleChange} className="mt-4 text-xl font-light max-md:max-w-full">
            {positionOptions.map((position, index) => (
              <option key={index} value={position}>{position}</option>
            ))}
          </select>
          <h2 className="mt-12 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">자기소개</h2>
          <textarea name="intro" value={profileData.intro} onChange={handleChange} className="shrink-0 mt-4 bg-white rounded-2xl border-2 border-solid border-[#4A90E2] h-[250px] p-4 max-md:max-w-full text-xl"></textarea>
          <h2 className="mt-10 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">관심 스택</h2>
          <select name="techStacks" multiple value={profileData.techStacks} onChange={handleChange} className="mt-4 text-xl font-light max-md:max-w-full">
            {techStackOptions.map((techStack, index) => (
              <option key={index} value={techStack}>{techStack}</option>
            ))}
          </select>
          <h2 className="mt-12 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">거주지</h2>
          <textarea name="residence" value={profileData.residence} onChange={handleChange} className="mt-4 text-xl font-light border-2 border-solid border-[#4A90E2] rounded-2xl p-4" />
          <h2 className="mt-12 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">신분</h2>
          <textarea name="status" value={profileData.status} onChange={handleChange} className="mt-4 text-xl font-light border-2 border-solid border-[#4A90E2] rounded-2xl p-4" />
          <h2 className="mt-12 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">성별</h2>
          <div className="mt-4 text-xl font-light max-md:max-w-full">
            <label className="mr-4">
              <input type="radio" name="gender" value="남" checked={profileData.gender === '남'} onChange={handleChange} /> 남
            </label>
            <label>
              <input type="radio" name="gender" value="여" checked={profileData.gender === '여'} onChange={handleChange} /> 여
            </label>
          </div>
          <div className="flex gap-4 mt-12">
            <button type="submit" className="justify-center self-start px-6 py-3 text-xl font-medium whitespace-nowrap bg-[#4A90E2] text-white rounded-2xl max-md:px-4">
              수정
            </button>
            <button onClick={() => setIsEditMode(false)} type="button" className="justify-center self-start px-6 py-3 text-xl font-medium whitespace-nowrap bg-gray-300 rounded-2xl max-md:px-4">
              수정 취소
            </button>
          </div>
        </form>
      ) : (
        <div className="mt-6">
          <div className="mt-6">
            <img src={profileData.photo ? profileData.photo : ProfileImage} alt="Profile" className="rounded-full w-24 h-24" /> {/* 변경: Profile -> ProfileImage */}
          </div>
          <h2 className="mt-16 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">분야</h2>
          <p className="mt-4 text-xl font-light max-md:max-w-full">{profileData.positions.join(', ')}</p>
          <h2 className="mt-12 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">자기소개</h2>
          <div className="shrink-0 mt-4 bg-white rounded-2xl border-2 border-solid border-[#4A90E2] h-[250px] p-4 max-md:max-w-full text-xl">
            {profileData.intro}
          </div>
          <h2 className="mt-10 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">관심 스택</h2>
          <p className="mt-4 text-xl font-light max-md:max-w-full">{profileData.techStacks.join(', ')}</p>
          <h2 className="mt-12 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">거주지</h2>
          <p className="mt-4 text-xl font-light max-md:max-w-full">{profileData.residence}</p>
          <h2 className="mt-12 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">신분</h2>
          <p className="mt-4 text-xl font-light max-md:max-w-full">{profileData.status}</p>
          <h2 className="mt-12 text-[#4A90E2] max-md:mt-8 max-md:max-w-full">성별</h2>
          <p className="mt-4 text-xl font-light max-md:max-w-full">{profileData.gender}</p>
          <button onClick={() => setIsEditMode(true)} className="justify-center self-start px-6 py-3 mt-12 text-xl font-medium whitespace-nowrap bg-[#4A90E2] text-white rounded-2xl max-md:px-4">
            수정하기
          </button>
        </div>
      )}
    </section>
  );
};

const MyUserEditPage: React.FC = () => (
  <div className="bg-white">
    <div className="flex gap-5 max-md:flex-col max-md:gap-0">
      <aside className="flex flex-col w-[24%] max-md:ml-0 max-md:w-full">
        <Nav items={navItems} />
      </aside>
      <section className="flex flex-col ml-5 w-[76%] max-md:ml-0 max-md:w-full">
        <UserProfile /> {/* 변경: Profile -> UserProfile */}
      </section>
    </div>
  </div>
);

export default MyUserEditPage;
