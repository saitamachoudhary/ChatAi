import React, { useEffect, useRef, useState } from 'react';
import { Image } from '@imagekit/react';
import Upload from '../Upload/index';

const NewPrompt = ({ messages,input, setInput, handleSubmit,handleKeyUp}) => {
    const [image, setImage] = useState(
        {
            isLoading: false,
            error: "",
            dbData: {},
            // aiData: {},
        }
    );
    const button_label_Style = 'rounded-[50%] bg-[#605e68] border-none p-[10px] flex items-center justify-center cursor-pointer';
    const Scroll_to_Bottom = useRef(null);
    useEffect(() => {
        Scroll_to_Bottom.current.scrollIntoView({ behavior: "smooth" });
    }, [input,image.dbData,messages]);
    return (
        <div className='NewPrompt flex items-center justify-center w-full'>
            {image.isLoading && <div className="">Loading...</div>}
            {image.dbData?.filePath && (
                <Image
                    urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                    src={image.dbData?.filePath}
                    width="380"
                // transformation={[{ width: 380 }]}
                />
            )}
            <div ref={Scroll_to_Bottom} className="end_chat pb-[100px]"></div>
            <form action="" onSubmit={handleSubmit} className='new_form
        w-1/2 absolute bottom-0 bg-[#2c2937] rounded-[20px] flex items-center
          gap-[20px] px-[20px]
        '>
                <Upload setImage={setImage} />
                <input type="text" placeholder='Ask anything...'
                    className='flex-1 p-[20px] border-none outline-none bg-transparent text-[#ececec]'
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyUp={handleKeyUp}
                />
                <button type='submit' className={`${button_label_Style}`} >
                    <img className='w-[16px] h-[16px]' src="/arrow.png" alt="" />
                </button>
            </form>
        </div>
    )
}

export default NewPrompt;