import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import DOMPurify from 'dompurify';
import BackButton from '../assets/images/BackButton.png';
import Profile from '../assets/images/Profile.svg';
import aws from '../assets/images/aws.png';
import Django from '../assets/images/Django.png';
import docker from '../assets/images/docker.png';
import Figma from '../assets/images/Figma.png';
import Flask from '../assets/images/Flask.png';
import Flutter from '../assets/images/Flutter.png';
import Git from '../assets/images/Git.png';
import Go from '../assets/images/Go.png';
import JS from '../assets/images/JS.png';
import Kotlin from '../assets/images/Kotlin.png';
import kubernetes from '../assets/images/kubernetes.png';
import MongoDB from '../assets/images/MongoDB.png';
import MySQL from '../assets/images/MySQL.png';
import Next from '../assets/images/Next.png';
import Node from '../assets/images/Node.png';
import php from '../assets/images/php.png';
import react from '../assets/images/React.png';
import ReactNative from '../assets/images/ReactNative.png';
import Ruby from '../assets/images/Ruby.png';
import Spring from '../assets/images/Spring.png';
import SVELTE from '../assets/images/SVELTE.png';
import Swift from '../assets/images/Swift.png';
import Ts from '../assets/images/Ts.png';
import Unity from '../assets/images/Unity.png';
import Vue from '../assets/images/Vue.png';

const techStackImages = {
  Spring,
  Node: Node,
  Django,
  Flask,
  Ruby,
  php,
  Go,
  MySQL,
  MongoDB,
  JavaScript: JS,
  TypeScript: Ts,
  React: react,
  Vue,
  SVELTE,
  Next: Next,
  Flutter,
  Swift,
  Kotlin,
  ReactNative: ReactNative,
  Unity,
  AWS: aws,
  Docker: docker,
  Kubernetes: kubernetes,
  Figma,
  Git,
};

function RecruitmentPage() {
  const { recruitmentId } = useParams();
  const [recruitment, setRecruitment] = useState(null);
  const navigate = useNavigate();

  const fetchRecruitment = async () => {
    const url = `http://localhost:8085/api/v1/recruitments/${recruitmentId}`;
    const token = localStorage.getItem('access_token');
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setRecruitment(data);
    } catch (error) {
      console.error('Fetch operation failed:', error);
    }
  };

  useEffect(() => {
    fetchRecruitment();
  }, [recruitmentId]);

  if (!recruitment) {
    return <div>Loading...</div>;
  }

  const handleApplyClick = () => {
    navigate(`/Submission/${recruitmentId}`);
  };

  const sanitizedIntroduction = DOMPurify.sanitize(recruitment.introduction);

  return (
    <div className="flex flex-col items-center pt-7 pb-12 bg-white">
      <div className="flex gap-5 px-5 w-full text-black whitespace-nowrap max-w-[1376px] max-md:flex-wrap max-md:max-w-full">
      <Link to="/Main" className="flex-auto text-6xl max-md:text-4xl text-[#4A90E2] font-nunito">
  Gaemoim
</Link>
      </div>
      <div className="self-stretch mt-6 w-full bg-[#4A90E2] min-h-[4px] max-md:max-w-full" />
      <div className="flex flex-col items-start mt-9 w-full text-2xl font-bold text-[#4A90E2] max-w-[1312px] max-md:max-w-full">
        <div className="mt-7 ml-20 text-3xl max-md:max-w-full">{recruitment.title}</div>
        <div className="flex gap-5 items-center mt-12 ml-20 whitespace-nowrap max-md:mt-10 max-md:ml-2.5">
        <img loading="lazy" 
        src={recruitment.photo ? recruitment.photo : Profile} 
        className="shrink-0 self-stretch aspect-square w-[50px]" 
        alt="Profile" 
        />

          <div className="self-stretch my-auto font-bold">{recruitment.name}</div>
          <div className="self-stretch my-auto">|</div>
          <div className="flex-auto self-stretch my-auto text-neutral-500">
            {new Date(recruitment.createdDate).toLocaleDateString()}
          </div>
        </div>
      </div>
      <div className="flex flex-col mt-6 w-full max-w-[1334px] max-md:max-w-full">
        <div className="shrink-0 h-1 bg-[#4A90E2] max-md:max-w-full" />
        <div className="self-center mt-16 w-full max-w-[1080px] max-md:mt-10 max-md:max-w-full">
          <div className="flex flex-col gap-8 max-md:flex-col max-md:gap-0">
            <div className="flex flex-col w-full max-md:ml-0 max-md:w-full">
              <div className="flex flex-col gap-10 mt-4 text-2xl font-bold max-md:mt-10">
                <div className="flex justify-between items-center text-[#4A90E2] ml-20 mr-20">
                  <div>모집 구분</div>
                  <div className="text-black ml-2">{recruitment.type}</div>
                </div>
                <div className="flex justify-between items-center text-[#4A90E2] ml-20 mr-20">
                  <div>모집 인원</div>
                  <div className="text-black ml-2">{recruitment.number}</div>
                </div>
                <div className="flex justify-between items-center text-[#4A90E2] ml-20 mr-20">
                  <div>모집 분야</div>
                  <div className="text-black ml-2">{recruitment.positions.join(', ')}</div>
                </div>
                <div className="flex justify-between items-center text-[#4A90E2] ml-20 mr-20">
                  <div>사용 언어</div>
                  <div className="flex ml-2">
                    {recruitment.techStacks.map((stack) => (
                      <img
                        key={stack}
                        loading="lazy"
                        src={techStackImages[stack]}
                        className="shrink-0 w-12 h-12 aspect-square ml-2"
                        alt={stack}
                      />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-center text-[#4A90E2] ml-20 mr-20">
                  <div>시작 예정</div>
                  <div className="text-black ml-2">{new Date(recruitment.startDate).toLocaleDateString()}</div>
                </div>
                <div className="flex justify-between items-center text-[#4A90E2] ml-20 mr-20">
                  <div>종료 예정</div>
                  <div className="text-black ml-2">{new Date(recruitment.endDate).toLocaleDateString()}</div>
                </div>
                <div className="flex justify-between items-center text-[#4A90E2] ml-20 mr-20">
                  <div>마감일</div>
                  <div className="text-black ml-2">{new Date(recruitment.deadline).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-4 border-[#4A90E2] flex-grow mt-10"></div>
        <div className="text-5xl font-bold text-[#4A90E2] mt-10 ml-40">프로젝트 소개</div>
        <div
          className="text-2xl text-black mt-10 ml-40"
          dangerouslySetInnerHTML={{ __html: sanitizedIntroduction }}
        />
        <div className="flex justify-end">
          <button
            className="mt-24 bg-[#4A90E2] hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleApplyClick}
          >
            지원하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default RecruitmentPage;
