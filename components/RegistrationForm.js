"use client"
import { useEffect, useContext } from 'react';
import LocationServices from 'components/LocationServices';
import hobbyList from 'util/hobbies';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'
import { RegistrationContext } from 'components/RegistrationContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}
export default function RegistrationForm({ isLocation, setIsLocation }) {
  const {username, setUsername, hobbies,
                setHobbies, description, setDescription, setImages, images, name, setName,
                streetAddress, setStreetAddress, zip, setZip, coord, setCoord,
                location, setLocation, manualLoc, setManualLoc, age, setAge,
                files, setFiles, preferredAge, setPreferredAge, preferredGender,
                setPreferredGender, preferredDistance, setPreferredDistance,
                isPersonality, setIsPersonality, Openness,
                Agreeableness, Extraversion, Conscientiousness,  Neuroticism, 
                entered, setEntered } = useContext(RegistrationContext)

  const router = useRouter();

  const { update } = useSession();

  useEffect(() => {
    if (!isPersonality) {
        if (entered === 'good') {
            createUser();
            setEntered(false);
            router.push('/dashboard')
        }
    };
  }, [entered]);

  const handleClick = async () => {
    if (username && name && description && hobbies.length === 6 && age >= 18 && location && files.length) {
      setEntered(true);
      setIsPersonality(true);
    } else {
      update({ flash: { type: 'error', message: 'Please fill out all fields.' } });
      window.location.reload();
    }
    };

   const createUser = async () => {

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('hobbies', hobbies);
    formData.append('streetAddress', streetAddress);
    formData.append('age', age);
    formData.append('zip', zip);
    formData.append('coordinates', coord);
    formData.append('username', username);
    formData.append('preferredAge', preferredAge);
    formData.append('preferredGender', preferredGender);
    formData.append('preferredDistance', preferredDistance);
    formData.append('Openness', Openness);
    formData.append('Agreeableness', Agreeableness);
    formData.append('Extraversion', Extraversion);
    formData.append('Conscientiousness', Conscientiousness);
    formData.append('Neuroticism', Neuroticism);
    
    files.forEach(file => {
        formData.append('files[]', file);
    });

    try {
        const response = await fetch('/api/user/registration', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

    } catch (error) {
        console.error("There was an error:", error);
        // Handle the error more comprehensively here
    }
}

  return (
      <div>
        <h1 className='block p-10 text-4xl font-extralight'>Profile Setup</h1>

      <div className='z-1 flex p-10 space-x-2 border-t w-11/12'>
        <div className={`sm:space-y-16 p-5 w-1/2 mx-auto bg-white rounded shadow-md ${isLocation && location ? 'hidden' : null}`}>
        <div>
          <h2 className="text-4xl font-extralight leading-7 text-black">Profile</h2>
          <p className="mt-1 max-w-2xl text-md leading-6 text-black font-extralight">
            This information will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-5 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="username" className="block text-lg font-extralight leading-6 text-black sm:pt-1.5">
                Username
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex rounded shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-black sm:max-w-md">
                  <input
                                        type="text"
                                        value={username}
                                        name="username"
                                        id="username"
                                        autoComplete="username"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        onChange={(event) => setUsername(event.target.value)}
                                    />
                </div>
              </div>
            </div>
<div>
          <div className="mt-10 border-b border-gray-900/10 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="first-name" className="block text-lg font-extralight leading-6 text-black sm:pt-1.5">
                Name
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="first-name"
                                    id="first-name"
                                    value={name}
                  autoComplete="given-name"
                  className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6"
                     onChange={(event) => setName(event.target.value)}
                                />
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="age" className="block text-lg font-extralight leading-6 text-black sm:pt-1.5">
               Age
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="age"
                id="age"
                value={age}
                  autoComplete="given-name"
                  className="block w-full rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6"
                     onChange={(event) => setAge(event.target.value)}
                                />
              </div>
            </div>
                        <div className='py-3 space-x-16'>
                    <LocationServices setCoord={setCoord} setIsLocation={setIsLocation} location={location} setLocation={setLocation} />
                                </div>
          </div>
        </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="about" className="block text-lg font-extralight leading-6 text-black sm:pt-1.5">
                About
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <textarea
                                    id="about"
                                    value={description}
                  name="about"
                  rows={3}
                  className="block w-full max-w-2xl rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-black sm:text-sm sm:leading-6"
                   onChange={(event) => setDescription(event.target.value)}
                />
                <p className="mt-3 text-md font-extralight leading-6 text-black">Write a few sentences about yourself.</p>
              </div>
                        </div>
              <div>
                <div className='flex w-full py-3 font-extralight space-x-10 leading-6 sm:pt-1.5'>
                  <h1 className='text-lg text-black '>Hobbies</h1>
                  <p className={`${hobbies.length < 6 ? "text-red-500" : "text-green-500"} text-sm py-1`}>{hobbies.length} chosen. Choose 6.</p>
                </div>
                                <div className="h-[10rem] overflow-y-scroll grid grid-cols-5 gap-4 py-6 ">
                                {
                    hobbyList.map((hobby, index) => {
                      return <p key={index} className={` text-black shadow-md text-xs text-center p-1 rounded cursor-pointer hover:scale-110 cursor-pointer hover:ring ring-inset ring-[#02F3B0] transition-all duration-300 ease-in-out`}
                        onClick={(event) => {
                                              if (hobbies.length  < 6) {
                                                setHobbies(prev => [...prev, hobby]);
                                              event.target.classList.add('bg-[#02F3B0]');
                          };
                          if (hobbies.indexOf(event.target.innerText) !== -1) {
                                  setHobbies(prev => prev.filter(hobby => hobby !== event.target.innerText))
                                      event.target.classList.remove('bg-[#02F3B0]');
                                }
                                            }}
                                        >{hobby}</p>
                                    })
                }
                            </div>
                        </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
              <label htmlFor="photo" className="block text-lg font-extralight leading-6 text-black">
                Photo
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex items-center gap-x-3">
                  <input
    type="file"
    multiple
    className="rounded bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    onChange={(event) => {
        // directly accessing event.target.files
        const newFiles = Object.values(event.target.files);
        setFiles(prev => [...prev, ...newFiles]);
    }}
/>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>

        <div className={` sm:space-y-16 p-5 w-1/2 mx-auto bg-white rounded shadow-md ${isLocation && location ? 'hidden' : null}`}>
          <div className='space-y-1'>
      <h1 className=' font-extralight text-black text-4xl'>Preferences</h1>
          <div className="sm:grid sm:grid-cols-1 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="age" className="block text-lg font-extralight leading-6 text-black sm:pt-1.5">
               Preferred Age
              </label>
              <div className="flex space-x-5">
                <h1 className={'text-4xl font-extralight text-black shadow-md text-center rounded w-[2rem] hover:scale-110 cursor-pointer hover:ring ring-inset ring-[#02F3B0]'}
                  onClick={() => {
                    if (preferredAge) {
                      if (preferredAge > 18) {
                          setPreferredAge(prev => parseInt(prev) - 1 );
                      }
                    } else {
                      setPreferredAge(27)
                    }
                  }}
                >-</h1>
                <input
                  type="text"
                  name="preferredAge"
                id="preferredAge"
                  value={preferredAge}
                  placeholder={age || "28"}
                  autoComplete="given-name"
                  className="block w-1/12 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black font-extralight text-center focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6"
                     onChange={(event) => setPreferredAge(event.target.value)}
                                />
                <h1 className={'text-4xl font-extralight text-black shadow-md text-center rounded w-[2rem] hover:scale-110 cursor-pointer hover:ring ring-inset ring-[#02F3B0]'}
                  onClick={() => {
                    if (preferredAge ) {
                        setPreferredAge(prev => parseInt(prev) + 1 );
                    } else {
                      setPreferredAge(29)
                    }
                  }}
                >+</h1>
              </div>
          </div>
          <div className="sm:grid sm:grid-cols-1 sm:items-start sm:gap-2 sm:py-2">
              <label htmlFor="age" className="block text-lg font-extralight leading-6 text-black sm:pt-1.5">
               Preferred Distance
              </label>
              <div className="flex space-x-5">
                <h1 className={'text-4xl font-extralight text-black shadow-md text-center rounded w-[2rem] hover:scale-110 cursor-pointer hover:ring ring-inset ring-[#02F3B0]'}
                  onClick={() => {
                    if (preferredDistance) {
                      if (preferredDistance > 1) {
                          setPreferredDistance(prev => parseInt(prev) - 1 );
                      }
                    } else {
                      setPreferredDistance(27)
                    }
                  }}
                >-</h1>
                <input
                  type="text"
                  name="preferredDistance"
                id="preferredDistance"
                  value={preferredDistance}
                  placeholder={10}
                  autoComplete="given-name"
                  className="block w-1/12 rounded border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black font-extralight text-center focus:ring-2 focus:ring-inset focus:ring-black sm:max-w-xs sm:text-sm sm:leading-6"
                     onChange={(event) => setPreferredDistance(event.target.value)}
                />
                 <h1 className={'text-4xl font-extralight text-black shadow-md text-center rounded w-[2rem] hover:scale-110 cursor-pointer hover:ring ring-inset ring-[#02F3B0]'}
                  onClick={() => {
                    if (preferredDistance) {
                        setPreferredDistance(prev => parseInt(prev) + 1 );
                    } else {
                      setPreferredDistance(29)
                    }
                  }}
                >+</h1>
              </div>
          </div>
          <div className="sm:grid sm:grid-cols-1 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="age" className="block text-lg font-extralight leading-6 text-black sm:pt-1.5">
               Preferred Gender Identity
              </label>
              <div className="flex space-x-5">
                <button className='p-2 w-2/12 rounded text-black font-extralight text-lg shadow-md text-center hover:scale-110 cursor-pointer hover:ring ring-inset ring-[#02F3B0]'
                  onClick={(event) => {
                    if (!preferredGender || !preferredGender.length) {
                      event.target.classList.add("bg-[#02F3B0]");
                    setPreferredGender('female')
                    } else {
                      if (preferredGender === event.target.innerText.toLowerCase()) {
                        event.target.classList.remove("bg-[#02F3B0]");
                      setPreferredGender('');
                      }
                    }
                  }}
                >Female</button>
                <button className='p-2 w-2/12 rounded text-black font-extralight text-lg shadow-md text-center hover:scale-110 cursor-pointer hover:ring ring-inset ring-[#02F3B0]'
                 onClick={(event) => {
                    if (!preferredGender || !preferredGender.length) {
                      event.target.classList.add("bg-[#02F3B0]");
                    setPreferredGender('male')
                    } else {
                      if (preferredGender === event.target.innerText.toLowerCase()) {
                        event.target.classList.remove("bg-[#02F3B0]");
                      setPreferredGender('');
                      }
                    }
                  }}
                >Male</button>
                <button className='p-2 w-2/12 rounded text-black font-extralight text-sm shadow-md text-center hover:scale-110 cursor-pointer hover:ring ring-inset ring-[#02F3B0]'
                  onClick={(event) => {
                    if (!preferredGender || !preferredGender.length) {
                      event.target.classList.add("bg-[#02F3B0]");
                    setPreferredGender('non-binary')
                    } else {
                      if (preferredGender === event.target.innerText.toLowerCase()) {
                        event.target.classList.remove("bg-[#02F3B0]");
                      setPreferredGender('');
                      }
                    }
                  }}
                >Non-Binary</button>
                <button className='p-2 w-2/12 rounded text-black font-extralight text-lg shadow-md text-center hover:scale-110 cursor-pointer hover:ring ring-inset ring-[#02F3B0]'
                  onClick={(event) => {
                    if (!preferredGender || !preferredGender.length) {
                      event.target.classList.add("bg-[#02F3B0]");
                    setPreferredGender('all')
                    } else {
                      if (preferredGender === event.target.innerText.toLowerCase()) {
                        event.target.classList.remove("bg-[#02F3B0]");
                      setPreferredGender('');
                      }
                    }
                  }}
                >All</button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-extralight leading-6 text-black hover:scale-110 "
                        onClick={() =>update({flash: {type: 'success', message:'THIS IS A NEW MESSAGE'}})}
                    >
          Cancel
        </button>
        <button
                    type="submit"
                    className="text-black inline-flex justify-center rounded shadow-md text-black px-3 py-2 text-sm font-extralight shadow-sm hover:bg-[#02F3B0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#02F3B0]"
                        onClick={() => {
                        handleClick();
                    }}
                >
          Save
        </button>
          </div>
        </div>
        
      </div>
            </div>

  )
};