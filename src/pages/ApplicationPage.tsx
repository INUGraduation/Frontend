import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MultipleChoiceForm from './components/MultipleChoiceForm';
import DescriptiveForm from './components/DescriptiveForm';
import FileUploadForm from './components/FileUploadForm';
import axios from 'axios';

const ApplicationPage = () => {
  const { recruitmentId } = useParams();
  const navigate = useNavigate();
  const [forms, setForms] = useState<{ key: number; form: JSX.Element; type: string; data: any }[]>([]);

  useEffect(() => {
    handleAddForm(); // 기본 질문을 추가
  }, []);

  const handleAddForm = () => {
    const key = Math.random();
    setForms((prevForms) => [
      ...prevForms,
      { key, form: <QuestionForm key={key} onTypeSelect={(type) => handleFormTypeSelect(key, type)} />, type: '', data: null },
    ]);
  };

  const handleFormTypeSelect = (key, type) => {
    let formComponent;
    switch (type) {
      case 'multiple':
        formComponent = <MultipleChoiceForm key={key} onChange={(data) => handleFormChange(key, data)} />;
        break;
      case 'descriptive':
        formComponent = <DescriptiveForm key={key} onChange={(data) => handleFormChange(key, data)} />;
        break;
      case 'file':
        formComponent = <FileUploadForm key={key} onChange={(data) => handleFormChange(key, data)} />;
        break;
      default:
        return;
    }
    setForms((prevForms) =>
      prevForms.map((form) => (form.key === key ? { ...form, form: formComponent, type } : form))
    );
  };

  const handleRemoveForm = (keyToRemove) => {
    setForms((prevForms) => prevForms.filter((form) => form.key !== keyToRemove));
  };

  const handleFormChange = (key, data) => {
    setForms((prevForms) => prevForms.map((form) => (form.key === key ? { ...form, data } : form)));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('access_token'); // 로컬 스토리지에서 토큰을 가져옴
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    try {
      // 1. 신청서 양식 생성
      const applicationResponse = await axios.post(
        `http://www.gaemoim.site/api/v1/recruitments/${recruitmentId}/applications`,
        {},
        { headers },
      );
      const applicationId = applicationResponse.data.applicationId;

      // 2. 각 질문 생성
      for (const { type, data } of forms) {
        let requestBody = { type, title: data.title };
        if (type === 'multiple') {
          requestBody = { ...requestBody, options: data.options.map((option) => option.value) };
        }
        await axios.post(`http://www.gaemoim.site/api/v1/applications/${applicationId}/questions`, requestBody, {
          headers,
        });
      }

      alert('신청서 양식 생성 완료!');
      navigate('/Main'); // Main 페이지로 이동
    } catch (error) {
      console.error('Error creating application or questions:', error);
      alert('Failed to create application or questions.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button onClick={handleAddForm} style={{ padding: '10px 20px', backgroundColor: '#4A90E2', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>질문 생성</button>
      </div>
      <div>
        {forms.map(({ key, form }) => (
          <div key={key} style={{ position: 'relative', marginBottom: '40px', border: '1px solid #4A90E2', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
            {form}
            <button
              onClick={() => handleRemoveForm(key)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '5px 10px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backgroundColor: '#4A90E2',
                color: 'white',
                border: 'none',
                borderRadius: '50%',
              }}
            >
              X
            </button>
          </div>
        ))}
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          생성
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link to="/Main" style={{ textDecoration: 'none', color: '#4A90E2' }}>돌아가기</Link>
      </div>
    </div>
  );
};

const QuestionForm = ({ onTypeSelect }) => {
  const [questionType, setQuestionType] = useState('');

  const handleTypeChange = (event) => {
    const selectedType = event.target.value;
    setQuestionType(selectedType);
    onTypeSelect(selectedType);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <div style={{
        width: '80%',
        padding: '20px',
        borderRadius: '10px',
        border: '1px solid #4A90E2',
        backgroundColor: '#E7F0FF',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
      }}>
        <select value={questionType} onChange={handleTypeChange} style={{ padding: '10px', borderRadius: '5px', border: '1px solid #4A90E2', width: '100%' }}>
          <option value="">질문 유형 선택...</option>
          <option value="multiple">객관식</option>
          <option value="descriptive">서술형</option>
          <option value="file">파일 업로드</option>
        </select>
      </div>
    </div>
  );
};

export default ApplicationPage;
