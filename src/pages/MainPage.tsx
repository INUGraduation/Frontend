import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Project from '../assets/images/Project.svg';
import Study from '../assets/images/Study.svg';

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

const RecruitmentCard = ({ id, title, date, positions, type, closing, techStacks }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/Recruitment/${id}`);
  };

  return (
    <article onClick={handleClick} className="relative cursor-pointer flex flex-col grow items-start p-6 mx-auto bg-white border-solid border-[1px] border-[#4A90E2] rounded-lg w-full h-full shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
      <header className="justify-center px-3 py-1.5 text-sm font-medium text-center text-[#4A90E2] uppercase whitespace-nowrap border-[1px] border-[#4A90E2] rounded-lg">
        {type}
      </header>
      <section className="flex gap-2 items-center mt-4 text-xs font-medium uppercase whitespace-nowrap text-neutral-500">
        <time className="self-stretch">마감일</time>
        <span className="self-stretch">|</span>
        <time className="self-stretch">{new Date(date).toLocaleDateString()}</time>
      </section>
      <h2 className="mt-4 text-xl font-semibold text-black uppercase line-clamp-2">
        {title}
      </h2>
      <section className="flex gap-1 mt-10 font-medium text-center text-black uppercase whitespace-nowrap max-md:mt-10">
        {positions.map((position, index) => (
          <span key={index} className="justify-center px-4 py-1.5 text-xs border-[1px] border-[#4A90E2] rounded-lg">
            {position}
          </span>
        ))}
      </section>
      <section className="flex gap-2 mt-4">
        {techStacks.map((tech, index) => (
          <div key={index} className="shrink-0 rounded-full h-8 w-8 flex items-center justify-center bg-gray-100">
            {techStackImages[tech] ? (
              <img src={techStackImages[tech]} alt={tech} className="h-6 w-6" />
            ) : (
              <div className="text-[#4A90E2]">{tech}</div>
            )}
          </div>
        ))}
      </section>
      
    </article>
  );
};

function MainPage() {
  const [recruitments, setRecruitments] = useState([]);
  const navigate = useNavigate();

  const fetchRecruitments = async () => {
    const url = `http://localhost:8085/api/v1/recruitments`;
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
      console.log('Fetched recruitments:', data);
      setRecruitments(data);
    } catch (error) {
      console.error('Fetch operation failed:', error);
    }
  };

  useEffect(() => {
    fetchRecruitments();
  }, []);

  return (
    <div className="flex flex-col items-center pt-7 bg-white shadow-sm">
      <div className="flex gap-5 px-5 w-full text-black whitespace-nowrap max-w-[1376px] max-md:flex-wrap max-md:max-w-full">
      <Link to="/Main" className="flex-auto text-6xl max-md:text-4xl text-[#4A90E2] font-nunito">
  Gaemoim
</Link>



        <div className="flex gap-8 my-auto text-3xl font-bold">
          <Link to="/write" className="flex-auto text-[#4A90E2] bg-[#E6F0FA] px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
            모집글 생성
          </Link>
          <Link to="/myPaste" className="flex-auto text-[#4A90E2] bg-[#E6F0FA] px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
            마이페이지
          </Link>
        </div>
      </div>
      <div className="self-stretch mt-6 w-full bg-[#4A90E2] h-[4px] max-md:max-w-full" />
      <div className="flex flex-col mt-7 w-full max-w-[1252px] max-md:max-w-full">
        <div className="px-5 mt-7 max-md:max-w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-md:flex-col max-md:gap-0">
            {recruitments.length > 0 ? (
              recruitments.map((recruitment) => (
                <div
                  key={recruitment.id}
                  className="flex flex-col max-md:ml-0 max-md:w-full cursor-pointer w-full h-[350px]"
                >
                  <RecruitmentCard
                    id={recruitment.id}
                    title={recruitment.title}
                    date={recruitment.deadline}
                    positions={recruitment.positions}
                    type={recruitment.type}
                    closing={recruitment.closing}
                    techStacks={recruitment.techStacks}
                  />
                </div>
              ))
            ) : (
              <div className="text-center w-full text-[#4A90E2]">모집글이 없습니다.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
