import React from 'react';

interface NoticeDetailProps {
  params: { id: string };
}

const NoticeDetail = ({ params }: NoticeDetailProps) => {
  const { id } = params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        공지 상세 (ID: {id})
      </h1>
      <p>여기에 {id} 번 공지의 내용을 렌더링하세요.</p>
    </div>
  );
};

export default NoticeDetail;
