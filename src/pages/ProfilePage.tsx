import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Profile from '../assets/images/Profile.svg';

interface ProfileData {
  name: string;
  photo: string;
  gender: string;
  intro: string;
  residence: string;
  status: string;
  positions: string[];
  techStacks: string[];
}

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(`http://www.gaemoim.site/api/v1/profiles/${userId}`, { headers });
        setProfileData(response.data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchProfileData();
  }, [userId]);

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <section className="flex flex-col items-center self-stretch px-4 my-auto text-black max-md:mt-8 max-md:max-w-full">
       <Link to="/Main" className="flex-auto text-6xl max-md:text-4xl text-[#4A90E2] font-nunito">
  Gaemoim
</Link>
      <div className="mt-6 flex flex-col items-center">
        <img src={profileData.photo ? profileData.photo : Profile} alt="Profile" className="rounded-full w-24 h-24" />
        <h2 className="text-3xl text-[#4A90E2] mt-4">{profileData.name}</h2>
      </div>
      <div className="flex justify-around w-full max-w-2xl mt-10">
        <ProfileSection title="자기소개" content={profileData.intro} />
      </div>
      <div className="flex justify-around w-full max-w-2xl mt-10">
        <ProfileSection title="분야" content={profileData.positions.join(', ')} />
        <ProfileSection title="관심 스택" content={profileData.techStacks.join(', ')} />
      </div>
      <div className="flex justify-around w-full max-w-2xl mt-10">
        <ProfileSection title="신분" content={profileData.status} />
        <ProfileSection title="성별" content={profileData.gender} />
        <ProfileSection title="거주지" content={profileData.residence} />
      </div>
    </section>
  );
};

interface ProfileSectionProps {
  title: string;
  content: string;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({ title, content }) => (
  <div className="flex flex-col items-center text-center mb-8 mx-4">
    <h2 className="text-2xl text-[#1E3A8A] max-md:text-xl">{title}</h2>
    <p className="mt-2 text-lg font-light max-md:text-base break-words" style={{ wordBreak: 'break-word' }}>{content}</p>
  </div>
);

export default ProfilePage;
