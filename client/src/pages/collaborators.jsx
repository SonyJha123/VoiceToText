import React from 'react'
import '../App.css';

import { BsArrowLeftCircleFill } from "react-icons/bs";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { BsThreeDotsVertical } from "react-icons/bs";
import { AiOutlineSend } from "react-icons/ai";
import { IoMicSharp } from "react-icons/io5";
import l_user1 from "../img/user1.png";
import l_user2 from "../img/user2.png"
import l_user3 from "../img/user3.png";
//import r_user1 from "../img/user4.png";
import star from "../img/star.svg";

const collaborators = () => {
  return (

     <div className="flex justify-center items-center bg-[url('https://i.ibb.co/3TZbQ7s/gradient-bg.png')] bg-center bg-no-repeat bg-cover h-screen"> {/* Apply purple only here */}
      <div className="w-full max-w-4xl mx-auto rounded-lg shadow-lg bg-[rgba(78,78,78,0.28)] py-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-6 border-b-2 border-gray-400 text-white p-2">
          <div className="flex gap-6 items-center">
            <BsArrowLeftCircleFill className="text-2xl ml-12 text-green-700" />
            <p className="text-start font-semibold text-xl font-serif">
              Cliff Weitzman
            </p>
            <TbRosetteDiscountCheckFilled className="text-2xl" />
          </div>
          <BsThreeDotsVertical className="ml-auto mr-10 text-2xl" />
        </div>
        {/* Chat Conversation Section */}
        <div className="p-6 mt-8">
          <div className="flex flex-col space-y-4">
            {/* User Message */}
            <div className="flex items-start gap-3">
              <img
                src={l_user1}
                alt="User Icon"
                className="w-10 h-10 rounded-full"
              />
              <div className='w-full'>
                <div className="bg-[rgba(255,254,254,0.05)] text-white p-3 rounded-lg max-w-xs flex flex-col">
                  <div className="flex gap-2 items-center font-medium">
                    <p>Gyweth</p>
                    <TbRosetteDiscountCheckFilled />
                  </div>
                  <p>Actress</p>
                </div>
                <span className="text-xs text-gray-500">12:00 PM, Today</span>
              </div>
            </div>
            {/* User Message */}
            <div className="flex items-start gap-3">
              <img
                src={l_user2}
                alt="User Icon"
                className="w-10 h-10 rounded-full"
              />
              <div className='w-full'>
                <div className="bg-[rgba(255,254,254,0.05)] text-white p-3 rounded-lg max-w-xs flex flex-col">
                  <div className="flex gap-2 items-center font-medium">
                    <p>Benjamin</p>
                    <TbRosetteDiscountCheckFilled />
                  </div>
                  <p>Youtuber</p>
                </div>
                <span className="text-xs text-gray-500">12:00 PM, Today</span>
              </div>
            </div>
            {/* Additional Messages */}
            <div className="flex items-start gap-3">
              <img
                src={l_user3}
                alt="User Icon"
                className="w-10 h-10 rounded-full"
              />
              <div className='w-full'>
                <div className="bg-[rgba(255,254,254,0.05)] text-white p-3 rounded-lg max-w-xs flex flex-col">
                  <div className="flex gap-2 items-center font-medium">
                    <p>Ali Abdal</p>
                    <TbRosetteDiscountCheckFilled />
                  </div>
                  <p>Musician</p>
                </div>
                <span className="text-xs text-gray-500">12:00 PM, Today</span>
              </div>
            </div>
          </div>
        </div>
        {/* Input Box Section */}
        <div className="flex items-center p-4">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full p-2 pl-10 border text-white rounded-3xl outline-none bg-transparent"
              placeholder="Ask me Anything..."
            />
            <div className="absolute inset-y-0 right-0 flex items-center gap-3 pr-3">
              <img className="text-black" src={star} alt="" />
              <IoMicSharp className="text-2xl text-gray-500 cursor-pointer" />
              <AiOutlineSend className="text-2xl text-blue-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default collaborators;
