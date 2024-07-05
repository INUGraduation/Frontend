import React, { useState } from 'react';

interface Option {
  id: number;
  value: string;
}

const MultipleChoiceForm = ({ onChange }) => {
  const [title, setTitle] = useState<string>('');
  const [options, setOptions] = useState<Option[]>([{ id: Date.now(), value: '' }]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    onChange({ title: event.target.value, options });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = options.map((option, i) => i === index ? { ...option, value } : option);
    setOptions(newOptions);
    onChange({ title, options: newOptions });
  };

  const addOption = () => {
    setOptions([...options, { id: Date.now(), value: '' }]);
  };

  const removeOption = (id: number) => {
    const newOptions = options.filter(option => option.id !== id);
    setOptions(newOptions);
    onChange({ title, options: newOptions });
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
      {options.map((option, index) => (
        <div key={option.id} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ width: '80%' }}>
            <input
              type="text"
              value={option.value}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              placeholder="선택지를 입력해주세요"
              style={{ width: 'calc(100% - 40px)' }}
            />
            <button onClick={() => removeOption(option.id)} style={{ width: '30px', marginLeft: '10px' }}>
              x
            </button>
          </div>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: '80%' }}>
          <button onClick={addOption}>선택지 추가</button>
        </div>
      </div>
    </div>
  );
};

export default MultipleChoiceForm;
