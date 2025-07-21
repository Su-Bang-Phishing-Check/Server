import { JSX } from "react";

interface ContactProps {
  id: number;
  name: string;
  phone: string;
  image: string;
}

const ContactList = ({ id, name, phone, image }: ContactProps): JSX.Element => {
  return (
    <div>
      <img
        src={image}
        alt={`${name}'s profile`}
        className="w-16 h-16 rounded-full"
      />
      <p>{phone}</p>
    </div>
  );
};

export default ContactList;
