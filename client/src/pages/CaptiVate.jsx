import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { preview } from "../assets";
import { getRandomPrompt } from "../utils";
import { FormField, Loader,Caption } from "../components";
import axios from 'axios';
import './CaptiVate.css';
const CaptiVate = () => {
  
  const [audioPlaying, setAudioPlaying] = useState(false);
  const playAudio = () => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = form.prompt;
    utterance.rate = 0.7;
    utterance.pitch=1;
    
    setTimeout(() => {
      synth.speak(utterance);
    }, 500);

    utterance.onstart = () => {
      setAudioPlaying(true);
    };

    utterance.onend = () => {
      setAudioPlaying(false);
    };
  };
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    prompt:"",
    photo: "",
    pic:"",
  });
  const [generatingText, setGeneratingText] = useState(false);
  const [loading, setloading] = useState(false);
  const [imgCap,setImgCap]=useState(null);
  const imagecaption=async ()=>{
    if (form.photo) {
      try {
        setGeneratingText(true);
        const formData = new FormData();
        formData.append('photo', form.photo);
  
        const reader=new FileReader();
        if(form.photo){
        reader.readAsDataURL(form.photo);
        reader.onloadend= ()=>{
           setImgCap({
            "inputs": { image: reader.result.split(',')[1] }
        });
        }
      }
        const response = await fetch(
          "https://api-inference.huggingface.co/models/adityarajkishan/ImageCaptioningTransformers",
          {
            headers: { Authorization: "Bearer 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"  },
            method: "POST",
            body: JSON.stringify(imgCap),
          }
        );
        const responseData = await response.json();
        // const generatedText = responseData[0].generated_text;
        console.log(responseData[0].generated_text)
        const ans=responseData[0].generated_text;
        setForm({...form,prompt:ans})
        // const result = await response.json();
        // return result;
      } catch (err) {
        alert(err);
      } finally {

        setGeneratingText(false);
      }
    } else {
      alert('Please provide a proper image');
    }
  }
  const annotateImage = async () => {
    if (form.photo) {
      try {
        setGeneratingText(true);
        const formData = new FormData();
        formData.append('photo', form.photo);
  
        const response = await fetch('http://127.0.0.1:5000/', {
          method: 'POST',
          body: formData,
        });
        // console.log(response);
        const data = await response.json();
        // console.log(data.message);
        let ans=data.message.slice(4);
        ans=ans.substr(0,ans.length-4);
        ans=ans+'.';
        setForm({...form,prompt:ans})
        console.log(form)
        // setForm({ ...form, photo: `data:image/jpeg;base64,${data.photo}` });
      } catch (err) {
        alert(err);
      } finally {

        setGeneratingText(false);
      }
    } else {
      alert('Please provide a proper image');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.prompt && form.photo) {
      setloading(true);
      try {
     
        // console.log(form.photo);
        const response=await fetch('http://localhost:8080/api/v1/postCap',{
          method:'POST',
          headers:{
            'Content-Type':'application/json',
          },body:JSON.stringify(form),
        })

        await response.json()
        navigate('/community');
      } catch (error) {
        alert(error)
      } finally {
        setloading(false);
      }
    }
    else {
      alert('Please Upload an image and generate the caption');
    }

  };

  const handleChange = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const [prevfile,setPrevfile]=useState(null);
  const [selectedfile,setSelectedfile]=useState(null);

  const handleImageChange = async (event) => {
    const setFileToBase= (file)=>{
      const reader=new FileReader();
      if(file){
      reader.readAsDataURL(file);
      reader.onloadend= ()=>{
        const picurl=reader.result;
        f(picurl);
      }
    }
    }
    const file = event.target.files[0];
    const ans=setFileToBase(file);
    setSelectedfile(file);
    if(file)
    setPrevfile(URL.createObjectURL(file))
    let picurl;
    const f=(e)=>{
      picurl=e;
      console.log(JSON.stringify(picurl))
      setForm({ ...form, photo: file,pic:picurl });
    }
  };
  return (
  

    <section className="max-w-7xl mx-auto">
      <div >
        <h1 className=" font-extrabold text-[#222328] text-[32px] ">Annotate</h1>
        <p className="mt-2 text-[#666e75] text-[16px] max-w-[500p x]">
          Explaining the contents of an image in the form of speech through caption generation
          and share them with the Community.
        </p>
      </div>
      <form className="mt-5 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Somya Dash"
            value={form.name}
            handleChange={handleChange}
          />
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-[45%] p-3 h-[45%] flex justify-center items-center">
            {form.photo ? (
              <img
                src={prevfile}
                alt={form.prompt}
                className="w-full h-full object-strech"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}
            {generatingText && (
              <div className="absolute inset-0  z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>
        <div className="mt-5 flex gap-5">
          <label htmlFor="upload-input" className='label px-5 py-2.5 font-medium rounded-md'>
            <span className='text-sm '>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"><path fill="none" d="M0 0h24v24H0z"></path><path fill="currentColor" d="M11 11V5h2v6h6v2h-6v6h-2v-6H5v-2z"></path></svg>   Upload
            </span>
          </label>
          <input
            type="file"
            id="upload-input"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />

          <button
            className="text-white bg-green-500 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            type="button"
            onClick={imagecaption}
          >
            {generatingText ? "Annotating..." : "Annotate"}
          </button>
          {form.prompt && <button
            className="text-white bg-[#e63946] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            type="button"
            onClick={playAudio} 
            disabled={!form.prompt || audioPlaying}
          >
            <span>&#9654;</span> Play
          </button>}

        </div>
        
       { form.prompt && <div className="mt-5">
        <Caption
            labelName="Caption"
            type="text"
            name="prompt"
            placeholder=""
            value={form.prompt}
            readOnly={true}
            handleChange={handleChange}
          />
        </div>}
        <div className="mt-5">
          <p className="mt-2 text-[#666e75] text-[14px]">
            Once you have created the image ,you can share it with others in the
            community
          </p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? "Sharing..." : "Share With Community"}
          </button>
        </div>
      </form>
    </section>
  )
}

export default CaptiVate