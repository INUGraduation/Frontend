import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SubmissionPage = () => {
  const { recruitmentId } = useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchApplicationForm = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };
        const response = await axios.get(`http://localhost:8085/api/v1/recruitments/${recruitmentId}/applications`, { headers });
        setApplication(response.data);
      } catch (error) {
        console.error('Failed to fetch application form:', error);
      }
    };

    fetchApplicationForm();
  }, [recruitmentId]);

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleCheckboxChange = (questionId, optionId) => {
    setResponses(prev => {
      const prevSelections = prev[questionId] || [];
      const newSelections = prevSelections.includes(optionId)
        ? prevSelections.filter(id => id !== optionId)
        : [...prevSelections, optionId];
      return {
        ...prev,
        [questionId]: newSelections
      };
    });
  };

  const handleCreateClick = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      // 첫 번째 API: 제출 생성
      const submissionResponse = await axios.post(`http://localhost:8085/api/v1/applications/${application.applicationId}/submissions`, {}, { headers });
      const submissionId = submissionResponse.data.submissionId;

      // 두 번째 API: 각 질문별 답변 제출
      for (const question of application.questions) {
        const formData = new FormData();
        let url = `http://localhost:8085/api/v1/applications/questions/${question.questionId}/submissions/${submissionId}/answers`;

        if (question.type === 'descriptive') {
          formData.append('content', responses[question.questionId] || '');
        } else if (question.type === 'multiple') {
          const optionIds = responses[question.questionId] || [];
          optionIds.forEach(id => formData.append('optionIds', id));
        } else if (question.type === 'file') {
          formData.append('file', responses[question.questionId]);
        }

        await axios.post(url, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
      }

      alert('신청서 제출 완료!');
      navigate('/Main'); // Main 페이지로 이동
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Submission failed');
    }
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'descriptive':
        return (
          <div style={{ margin: '10px', padding: '10px' }}>
            <div style={{ borderBottom: '2px solid #4A90E2' }}>
              <label style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{question.title}</label>
            </div>
            <input
              type="text"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '10px' }}
              value={responses[question.questionId] || ''}
              onChange={(e) => handleInputChange(question.questionId, e.target.value)}
            />
          </div>
        );
      case 'file':
        return (
          <div style={{ margin: '10px', padding: '10px' }}>
            <div style={{ borderBottom: '2px solid #4A90E2' }}>
              <label style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{question.title}</label>
            </div>
            <input
              type="file"
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '10px' }}
              onChange={(e) => handleInputChange(question.questionId, e.target.files[0])}
            />
          </div>
        );
      case 'multiple':
        return (
          <div style={{ margin: '10px', padding: '10px' }}>
            <div style={{ borderBottom: '2px solid #4A90E2' }}>
              <label style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{question.title}</label>
            </div>
            {question.options.map(option => (
              <div key={option.optionId} style={{ margin: '5px 0' }}>
                <input
                  type="checkbox"
                  name={question.questionId}
                  value={option.optionId}
                  checked={(responses[question.questionId] || []).includes(option.optionId)}
                  onChange={() => handleCheckboxChange(question.questionId, option.optionId)}
                  style={{ marginRight: '10px' }}
                />
                {option.content}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  if (!application) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      {application && application.questions.map(question => (
        <div key={question.questionId} style={{ marginBottom: '20px', border: '1px solid #4A90E2', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          {renderQuestion(question)}
        </div>
      ))}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button
          onClick={handleCreateClick}
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
          제출하기
        </button>
      </div>
    </div>
  );
};

export default SubmissionPage;
