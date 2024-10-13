import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface Choice {
  optionId: number;
}

interface Answer {
  questionId: number;
  content: string | null;
  choices: Choice[] | null;
}

interface SubmissionData {
  userId: number;
  status: string;
  answers: Answer[];
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

const ViewSubmissionPage: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const query = useQuery();
  const recruitmentId = query.get('recruitmentId');
  const [application, setApplication] = useState<any>(null);
  const [responses, setResponses] = useState<{ [key: string]: any }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!recruitmentId) {
      setError('Recruitment ID is missing');
      setLoading(false);
      return;
    }

    const fetchSubmissionData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const headers = {
          'Authorization': `Bearer ${token}`
        };

        // 신청서 양식 가져오기
        const applicationResponse = await axios.get(`http://localhost:8085/api/v1/recruitments/${recruitmentId}/applications`, { headers });
        setApplication(applicationResponse.data);

        // 제출된 답변 가져오기
        const submissionResponse = await axios.get<SubmissionData>(`http://localhost:8085/api/v1/applications/${applicationResponse.data.applicationId}/submissions/${submissionId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const submissionData = submissionResponse.data;

        // 제출된 답변을 초기 응답으로 설정
        const initialResponses: { [key: string]: any } = {};
        submissionData.answers.forEach((answer: any) => {
          if (answer.choices) {
            initialResponses[answer.questionId] = answer.choices.map((choice: any) => choice.optionId);
          } else {
            initialResponses[answer.questionId] = answer.content;
          }
        });
        setResponses(initialResponses);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSubmissionData();
  }, [recruitmentId, submissionId]);

  const handleAccept = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      await axios.patch(`http://localhost:8085/api/v1/applications/${application.applicationId}/submissions/${submissionId}/accepting`, {}, { headers });
      alert('신청서 수락 완료!');
      navigate(`/Recruitment_Owner/${recruitmentId}`);
    } catch (err) {
      console.error('Accepting submission failed:', err);
      alert('Accepting submission failed');
    }
  };

  const handleReject = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };

      await axios.patch(`http://localhost:8085/api/v1/applications/${application.applicationId}/submissions/${submissionId}/rejecting`, {}, { headers });
      alert('신청서 거절 완료!');
      navigate(`/Recruitment_Owner/${recruitmentId}`);
    } catch (err) {
      console.error('Rejecting submission failed:', err);
      alert('Rejecting submission failed');
    }
  };

  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'descriptive':
        return (
          <div style={{ margin: '10px', padding: '10px' }}>
            <div style={{ borderBottom: '2px solid #4A90E2' }}>
              <label style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{question.title}</label>
            </div>
            <textarea
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '10px' }}
              value={responses[question.questionId] || ''}
              readOnly
            />
          </div>
        );
      case 'file':
        return (
          <div style={{ margin: '10px', padding: '10px' }}>
            <div style={{ borderBottom: '2px solid #4A90E2' }}>
              <label style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{question.title}</label>
            </div>
            {responses[question.questionId] ? (
              <div>
                <button
                  onClick={() => window.open(responses[question.questionId], '_blank')}
                  style={{
                    marginTop: '10px',
                    backgroundColor: '#4A90E2',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                  }}
                >
                  파일 보기
                </button>
              </div>
            ) : (
              <input
                type="text"
                style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', marginTop: '10px' }}
                value="No file uploaded"
                readOnly
              />
            )}
          </div>
        );
      case 'multiple':
        return (
          <div style={{ margin: '10px', padding: '10px' }}>
            <div style={{ borderBottom: '2px solid #4A90E2' }}>
              <label style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{question.title}</label>
            </div>
            {question.options.map((option: any) => (
              <div key={option.optionId} style={{ margin: '5px 0' }}>
                <input
                  type="checkbox"
                  name={question.questionId}
                  value={option.optionId}
                  checked={(responses[question.questionId] || []).includes(option.optionId)}
                  readOnly
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      {application && application.questions.map((question: any) => (
        <div key={question.questionId} style={{ marginBottom: '20px', border: '1px solid #4A90E2', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
          {renderQuestion(question)}
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#4A90E2',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
          onClick={handleAccept}
        >
          수락
        </button>
        <button
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            backgroundColor: '#003366',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
          onClick={handleReject}
        >
          거절
        </button>
      </div>
    </div>
  );
};

export default ViewSubmissionPage;
