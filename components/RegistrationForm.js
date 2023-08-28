"use client"
import { useState, useEffect } from 'react';
import LocationServices from 'components/LocationServices';
import hobbyList from 'util/hobbies';
import { Switch } from '@headlessui/react';
import { useSession } from 'next-auth/react';
import {useRouter} from 'next/navigation'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function RegistrationForm() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [hobbies, setHobbies] = useState([]);
    const [description, setDescription] = useState('');
    const [images, setImages] = useState([]);
    const [streetAddress, setStreetAddress] = useState('');
    const [zip, setZip] = useState('');
    const [coord, setCoord] = useState([]);
    const [entered, setEntered] = useState(false);
    const [location, setLocation] = useState(undefined);
    const [manualLoc, setManualLoc] = useState(false);
    const [age, setAge] = useState('');
  const [files, setFiles] = useState([]);
  const [preferredAge, setPreferredAge] = useState('');
  const [preferredGender, setPreferredGender] = useState('');
  const [preferredDistance, setPreferredDistance] = useState('');
    const {data: session, update } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (entered === 'good') {
            createUser();
            setEntered(false);
            router.push('/mingle')
        }
    }, [entered]);

    const handleClick = async () => {
        if (!manualLoc) {
            if ("geolocation" in navigator) {
                navigator.geolocation.getCurrentPosition(async function success(pos) {
                    const crd = pos.coords;
                    //      
                    await fetch(`/api/user/location`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ lat: crd.latitude, lng: crd.longitude }),
                    }).then(async data => {
                        const res = await data.json();
                        setLocation([res.location.data[0].longitude, res.location.data[0].latitude]);
                    }).catch(err => console.log(err));
                })
            } else {
                console.log("NO LOCATION AVAILABLE")
            }
        } else {
              setLocation(streetAddress + ' ' + zip);
        }
    };

    const createUser = async (e) => {
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
        
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = function(event) {
                const arrayBuffer = event.target.result;
                const newBuffer = Buffer.from(arrayBuffer);
                formData.append('files[]', newBuffer)
};
            reader.readAsArrayBuffer(file);
        })
        setTimeout(async () => {
            await fetch('/api/user/registration', {
                method: 'POST',
                body: formData,
            }).then(data => {
                console.log(data);
            }).catch(err => console.log(err))
        }, 1000);
    }
    return (
        <div className='z-1'>
            {
                entered && location?
                    <LocationServices setCoord={setCoord} setEntered={setEntered} location={location} setLocation={setLocation} /> : null
 
            }
      <div className="space-y-12 sm:space-y-16 p-5 w-1/2 mx-auto bg-white rounded-lg">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-600">
            This information will be displayed publicly so be careful what you share.
          </p>

          <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="username" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Username
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
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
          <div className="mt-10 space-y-8 border-b border-gray-900/10 pb-12 sm:space-y-0 sm:divide-y sm:divide-gray-900/10 sm:border-t sm:pb-0">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Name
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="first-name"
                                    id="first-name"
                                    value={name}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                     onChange={(event) => setName(event.target.value)}
                                />
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
               Age
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="age"
                id="age"
                value={age}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                     onChange={(event) => setAge(event.target.value)}
                                />
              </div>
            </div>
                        <div className='flex py-3 space-x-3'>
                            <h1 className='text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>Set Location Manually</h1>
                                    {
                                        !entered ?
                        <Switch
              checked={manualLoc}
              onChange={setManualLoc}
              className={classNames(
                manualLoc ? 'bg-indigo-600' : 'bg-gray-200',
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
              )}
            >
              <span
                aria-hidden="true"
                className={classNames(
                  manualLoc ? 'translate-x-5' : 'translate-x-0',
                  'inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
                )}
              />
            </Switch>: ''
            }
                                </div>
                                {
                            manualLoc ? 
                                <div>
                                <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="street-address" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                Street address
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="street-address"
                                    id="street-address"
                                    value={streetAddress}
                  autoComplete="street-address"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xl sm:text-sm sm:leading-6"
                     onChange={(event) => setStreetAddress(event.target.value)}
                                />
              </div>
            </div>


            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="postal-code" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                ZIP / Postal code
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="postal-code"
                                    id="postal-code"
                                    value={zip}
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                   onChange={(event) => setZip(event.target.value)}
                                />
              </div>
                                    </div>
                                </div> : ''
                        }
          </div>
        </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
                About
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <textarea
                                    id="about"
                                    value={description}
                  name="about"
                  rows={3}
                  className="block w-full max-w-2xl rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                   onChange={(event) => setDescription(event.target.value)}
                />
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
              </div>
                        </div>
                        <div>
                            <h1 className='text-sm font-medium leading-6 text-gray-900 sm:pt-1.5'>Hobbies</h1>
                                <div className="h-[10rem] overflow-y-scroll grid grid-cols-5 gap-4 py-6 ">
                            
                                {
                                    hobbyList.map((hobby, index) => {
                                        return <p key={index} className='text-white text-sm bg-indigo-600/50 text-center rounded-full cursor-pointer hover:bg-indigo-800/70'
                                            onClick={() => {
                                                const allHobbies = hobbies;
                                                allHobbies.push(hobby);
                                                setHobbies(allHobbies)
                                            }}
                                        >{hobby}</p>
                                    })
                }
                            </div>
                        </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-center sm:gap-4 sm:py-6">
              <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                Photo
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <div className="flex items-center gap-x-3">
                  <input
                                        type="file"
                                        multiple
                                        value={images}
                                        className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                        onChange={(event) => 
                                             {
                                             setImages(event.target.value)
                                            Object.values(event.target.files).forEach(image => {
                                                setFiles(prev => [...prev, image]);
                                            });
                                        }
                                        }
                                    />
                </div>
              </div>
            </div>
          </div>
          </div>
          <div className='space-y-1'>
<h1 className='text-center text-black text-xl'>Preferences</h1>
          <div className="sm:grid sm:grid-cols-1 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
               Preferred Age
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="preferredAge"
                id="preferredAge"
                value={preferredAge}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                     onChange={(event) => setPreferredAge(event.target.value)}
                                />
              </div>
          </div>
          <div className="sm:grid sm:grid-cols-1 sm:items-start sm:gap-2 sm:py-2">
              <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
               Preferred Distance
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="preferredDistance"
                id="preferredDistance"
                value={preferredDistance}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                     onChange={(event) => setPreferredDistance(event.target.value)}
                                />
              </div>
          </div>
          <div className="sm:grid sm:grid-cols-1 sm:items-start sm:gap-4 sm:py-6">
              <label htmlFor="age" className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5">
               Preferred Gender Identity
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <input
                  type="text"
                  name="preferredGender"
                id="preferredGender"
                value={preferredGender}
                  autoComplete="given-name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                     onChange={(event) => setPreferredGender(event.target.value)}
                                />
              </div>
            </div>
          </div>
          

        <div className="mt-6 flex items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900"
                        onClick={() =>update({flash: {type: 'success', message:'THIS IS A NEW MESSAGE'}})}
                    >
          Cancel
        </button>
        <button
                    type="submit"
                    className="inline-flex justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={() => {
                        setEntered(true)
                        handleClick();
                    }}
                >
          Save
        </button>
          </div>
        </div>
            </div>
  )
}

