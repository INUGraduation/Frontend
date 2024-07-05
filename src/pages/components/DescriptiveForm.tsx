import React, { useState } from 'react';

const DescriptiveForm = ({ onChange }) => {
  const [title, setTitle] = useState<string>(''); 

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onChange({ title: event.target.value }); // 부모 컴포넌트에 변경 사항을 전달
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '80%', borderBottom: '2px solid #007bff', paddingBottom: '5px' }}>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="질문을 입력해주세요"
            style={{ fontWeight: 'bold', fontSize: '1.2em', width: '100%' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DescriptiveForm;
