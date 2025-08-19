'use client';
import { JSX } from 'react';
import { ContactType } from '../page';

const ContactList = ({
  name,
  phone,
  url,
}: ContactType): JSX.Element => {
  const onClickHandler = (url: string) => {
    if (!url) return;
    console.log('click');
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      type="button"
      onClick={() => onClickHandler(url)}
      className="flex flex-col md:flex-row items-center p-3 md:p-4 bg-white rounded-lg text-black shadow-sm
    text-[1rem] md:text-[1.25rem] select-none h-[75px] md:h-[90px] 
    cursor-pointer"
    >
      <p className="w-full md:w-3/5 font-bold">{name}</p>
      <p className="w-full md:w-2/5 md:flex-col font-medium md:hidden text-center mt-1">
        {phone?.[0] ?? ''}
      </p>
      <div className="hidden md:inline-block w-full md:w-2/5 flex md:flex-col font-medium">
        {phone.map((phone, index) => (
          <p key={index}>{phone}</p>
        ))}
      </div>
    </button>
  );
};

export default ContactList;
