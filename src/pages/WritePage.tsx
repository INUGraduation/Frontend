import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import BackButton from '../assets/images/BackButton.png';

function WritePage() {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('프로젝트');
  const [number, setNumber] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [deadline, setDeadline] = useState('');
  const [techStackIds, setTechStacks] = useState([]);
  const [positionIds, setPositions] = useState([]);
  const [introduction, setIntroduction] = useState('');
  const navigate = useNavigate();
  const quillRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      title,
      type,
      number: parseInt(number, 10),
      startDate,
      endDate,
      deadline,
      techStackIds: techStackIds.map((tech) => parseInt(tech, 10)),
      positionIds: positionIds.map((pos) => parseInt(pos, 10)),
      introduction,
    };

    try {
      const response = await fetch('http://localhost:8085/api/v1/recruitments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify(newPost),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Server response:', data);

      const recruitmentId = data.recruitmentId;
      if (recruitmentId) {
        navigate(`/Application/${recruitmentId}`);
      } else {
        console.error('Recruitment ID not found in the response');
      }
    } catch (error) {
      console.error('Fetch operation failed:', error);
    }
  };

  const handleMultiSelectChange = (e, setState) => {
    const options = e.target.options;
    const selectedOptions = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedOptions.push(options[i].value);
      }
    }
    setState(selectedOptions);
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append('file', file);

      if (quillRef.current) {
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection(true);

        try {
          const response = await fetch('http://localhost:8085/api/v1/recruitments/image', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Image upload failed');
          }

          const data = await response.text();
          if (range) {
            quill.insertEmbed(range.index, 'image', data);
            quill.setSelection(range.index + 1);
          }
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    };
  };

  const modules = useCallback(
    () => ({
      toolbar: {
        container: [
          [{ header: '1' }, { header: '2' }, { font: [] }],
          [{ size: [] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
          [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
          ['link', 'image', 'video'],
          ['clean'],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
    }),
    [],
  );

  const handleIntroductionChange = useCallback((value) => {
    setIntroduction(value);
  }, []);

  useEffect(() => {
    if (quillRef.current) {
      const quill = quillRef.current.getEditor();
      quill.getModule('toolbar').addHandler('image', handleImageUpload);
    }
  }, [handleImageUpload]);

  return (
    <div className="flex flex-col pt-7 pb-14 bg-white">
      <div className="flex gap-5 self-center px-5 w-full text-black whitespace-nowrap max-w-[1376px] max-md:flex-wrap max-md:max-w-full">
      <Link to="/Main" className="flex-auto text-6xl max-md:text-4xl text-[#4A90E2] font-nunito">
  Gaemoim
</Link>
      </div>
      <div className="mt-6 w-full bg-[#4A90E2] min-h-[4px] max-md:max-w-full" />
      <div className="flex flex-col px-20 mt-9 w-full max-md:px-5 max-md:max-w-full">
        <div className="flex items-center">
          <div className="ml-5 text-4xl font-bold text-[#4A90E2] max-md:max-w-full">
            프로젝트 기본 정보를 입력해주세요.
          </div>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col mt-7 space-y-6">
          <div className="self-center w-full max-w-[1162px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-[#4A90E2]">제목</div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-3 p-3 bg-white border border-[#4A90E2] rounded-lg"
                  placeholder="제목을 입력해주세요"
                />
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-[#4A90E2]">모집 구분</div>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-3 p-3 bg-white border border-[#4A90E2] rounded-lg"
                >
                  <option value="프로젝트">프로젝트</option>
                  <option value="스터디">스터디</option>
                </select>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-[#4A90E2]">모집 인원</div>
                <input
                  type="number"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="mt-3 p-3 bg-white border border-[#4A90E2] rounded-lg"
                  placeholder="모집 인원 수"
                />
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-[#4A90E2]">시작 ~ 종료</div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-3 p-3 bg-white border border-[#4A90E2] rounded-lg"
                />
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="mt-3 p-3 bg-white border border-[#4A90E2] rounded-lg"
                />
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-[#4A90E2]">기술 스택</div>
                <select
                  multiple
                  value={techStackIds}
                  onChange={(e) => handleMultiSelectChange(e, setTechStacks)}
                  className="mt-3 p-3 bg-white border border-[#4A90E2] rounded-lg"
                >
                  <option value="1">Spring</option>
                  <option value="2">Node</option>
                  <option value="3">Django</option>
                  <option value="4">Flask</option>
                  <option value="5">Ruby</option>
                  <option value="6">php</option>
                  <option value="7">GO</option>
                  <option value="8">MySQL</option>
                  <option value="9">MongoDB</option>
                  <option value="10">JavaScript</option>
                  <option value="11">TypeScript</option>
                  <option value="12">React</option>
                  <option value="13">Vue</option>
                  <option value="14">SVELTE</option>
                  <option value="15">Next.js</option>
                  <option value="16">Flutter</option>
                  <option value="17">Swift</option>
                  <option value="18">Kotlin</option>
                  <option value="19">React Native</option>
                  <option value="20">Unity</option>
                  <option value="21">AWS</option>
                  <option value="22">Docker</option>
                  <option value="23">Kubernetes</option>
                  <option value="24">Figma</option>
                  <option value="25">Git</option>
                </select>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-[#4A90E2]">모집 포지션</div>
                <select
                  multiple
                  value={positionIds}
                  onChange={(e) => handleMultiSelectChange(e, setPositions)}
                  className="mt-3 p-3 bg-white border border-[#4A90E2] rounded-lg"
                >
                  <option value="1">프론트엔드</option>
                  <option value="2">백엔드</option>
                  <option value="3">모바일</option>
                </select>
              </div>
              <div className="flex flex-col">
                <div className="text-2xl font-bold text-[#4A90E2]">모집 마감일</div>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="mt-3 p-3 bg-white border border-[#4A90E2] rounded-lg"
                />
              </div>
            </div>
          </div>
          <div className="self-center w-full max-w-[1162px] mb-10">
            <div className="flex flex-col mt-5">
              <div className="text-2xl font-bold text-[#4A90E2]">프로젝트에 대해 소개해주세요.</div>
              <ReactQuill
              value={introduction}
              modules={modules()}
              ref={quillRef}
              onChange={handleIntroductionChange}
              className="mt-3 bg-white border border-[#4A90E2] rounded-lg h-96"
              />
              </div>
              </div>

          <div className="flex gap-5 justify-end self-end text-2xl font-bold" style={{ marginTop: '100px' }}>
            <button type="submit" className="px-9 py-4 text-white bg-[#4A90E2] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
              글 등록
            </button>
            <button type="button" className="px-9 py-4 text-[#4A90E2] whitespace-nowrap bg-white border border-[#4A90E2] rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 ease-in-out">
              취소
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default WritePage;
