import axios from "axios"
import dynamic from "next/dynamic"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useAlert } from "../../../../utils/alertcontext"
const AdminLayout = dynamic(() => import("../../../../components/dashboards/admin/adminlayout"))
const Title = dynamic(() => import("../../../../components/title"))

export default function AdminList() {
  const [name, setName] = useState('')
  const [nameError, setNameError] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [designation, setDesignation] = useState('')
  const [designationError, setDesignationError] = useState('')
  const [allDesignation, setAllDesignation] = useState('')
  const [searchName, setSearchName] = useState('')
  const [users, setUsers] = useState('')
  const { showAlert } = useAlert()
  const router = useRouter()
  const handleChangeSearchName = (e) => {
    setSearchName(e.target.value);
  }
  const handleChangeDesignation = (e) => {
    setDesignation(e.target.value);
    setDesignationError('')
  }
  const handleChangeName = (e) => {
    const inputValue = e.target.value;
    if (/^[A-Z][a-zA-z ]*$/.test(inputValue)) {
      setName(inputValue);
      setNameError('')
    }
    else {
      setNameError('Name should start with a capital letter')
    }
    if (inputValue == "") {
      setName('')
    }
  }
  const handleChangeEmail = (e) => {
    const inputValue = e.target.value;
    setEmail(inputValue);
    setEmailError('');

    if (!checkEmail(inputValue)) {
      setEmailError('Incorrect email format');
    }
  };
  const handleChangePhone = (e) => {
    const inputValue = e.target.value;
    setPhone(inputValue);
    setPhoneError('');

    if (!checkPhone(inputValue)) {
      setPhoneError('Incorrect phone number format');
    }
  };

  function checkPhone(data) {
    if (/^01[3-9]\d{8}$/.test(data)) {
      return true
    }
    else {
      return false
    }
  }
  function checkEmail(data) {
    if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(data)) {
      return true
    }
    else {
      return false
    }
  }
  const handleAdd = async (e) => {
    e.preventDefault()
    if(!designation){
      setDesignationError('Select a designation')
    }
    if (!checkEmail(email) || !checkPhone(phone)) {
      showAlert('Must provide valid email and phone number')
    }
    if (!name || !phone || !email || !designation) {
      showAlert('Must provide name, phone, email and designation properly')
    }
    else {
      const result = await addUser(name, email, phone, designation)
      if (result != null) {
        showAlert(`User added successfully`)
        getUsers()
        setName('')
        setEmail('')
        setPhone('')
        setDesignation('')
      }
      else {
        showAlert(`User Couldnot added`)
        setName('')
        setEmail('')
        setPhone('')
        setDesignation('')
      }
      setName('')
      setEmail('')
      setPhone('')
      setDesignation('')
    }
  }
  async function addUser(name, email, phone, designation) {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/addadmin'
      const userData = {
        name: name,
        email: email,
        phoneNumber: phone,
        designation: designation
      }
      const result = await axios.post(url, userData, {
        withCredentials: true
      });
      return result.data
    }
    catch (err) {
      console.log(err)
      showAlert('Something went wrong, try again')
    }
  }
  const getUsers = async (e) => {
    try {
      const searchingName = searchName == undefined ? undefined : searchName
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/getadminbyname/' + searchingName;
      const result = await axios.get(url, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      })
      setUsers(result.data)
      if (result.data.length === 0) {
        showAlert('No admin found')
      }
      else {
        return result.data
      }
    }
    catch (err) {
      console.log(err)
      showAlert("Something went wrong, please try again letter")
    }
  };

  const getAllDesignations = async (e) => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/getalldesignations';
      const result = await axios.get(url, {
        withCredentials: true
      })
      setAllDesignation(result.data)
    }
    catch (err) {
      console.log(err)
      showAlert("Something went wrong, please try again letter")
    }
  };

  const handleUpdate = (id) => {
    router.push(`./updateadmin?id=${id}`)
  }
  const handleDelete = async (id) => {
    try {
      const url = process.env.NEXT_PUBLIC_BACKEND_ENDPOINT + 'admin/deleteadmin/' + id
      const result = await axios.delete(url, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        withCredentials: true
      })
      showAlert(result.data)
      getUsers()
    }
    catch (err) {
      showAlert('Couldnot perform delete operations, try again')
    }
  }
  useEffect(() => {
    getUsers();
    getAllDesignations()
  }, [searchName]);
  return (
    <>
      <Title page="User List"></Title>
      <AdminLayout>
        <div>
          <h6 className="text-xl font-semibold dark:text-white">Admin Corner</h6>
          <hr className="h-px bg-gray-200 border-1 dark:bg-gray-700" />
          <div>
            <h6 className="text-md font-semibold text-center py-4">Add New Admin</h6>
            <form onSubmit={handleAdd}>
              <div class="grid gap-4 sm:grid-cols-2 sm:gap-6">
                <div class="w-full">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Name</label>
                  <input type="text" name="name" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter name" required onChange={handleChangeName} value={name} />
                  <span class="font-medium">
                    {nameError && <p class="pb-2 mt-0.5 text-xs text-red-600 dark:text-red-400">{nameError}</p>}
                  </span>
                </div>
                <div class="w-full">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                  <input type="email" name="email" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter email" required onChange={handleChangeEmail} value={email} />
                  <span class="font-medium">
                    {emailError && <p class="pb-2 mt-0.5 text-xs text-red-600 dark:text-red-400">{emailError}</p>}
                  </span>
                </div>
                <div class="w-full">
                  <label for="brand" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Phone Number</label>
                  <input type="text" name="phone" id="brand" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Name" required onChange={handleChangePhone} value={phone} />
                  <span class="font-medium">
                    {phoneError && <p class="pb-2 mt-0.5 text-xs text-red-600 dark:text-red-400">{phoneError}</p>}
                  </span>
                </div>
                <div>
                  <label for="category" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Designation</label>
                  <select id="category" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" onChange={handleChangeDesignation}>
                    <option selected="">Select Designation</option>
                    {Array.isArray(allDesignation)
                      ? (
                        allDesignation.map((item, index) => (
                          <>
                            <option value={`${item.id}`}>{item.name}</option>
                          </>
                        ))) : (
                        <>
                          <option selected="">No Designation found</option>
                        </>
                      )
                    }
                  </select>
                  <span class="font-medium">
                    {designationError && <p class="pb-2 mt-0.5 text-xs text-red-600 dark:text-red-400">{designationError}</p>}
                  </span>
                </div>
              </div>
              <div className="md:col-span-2 py-4 flex justify-center">
                <button type="submit"
                  className="my-2 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  Add User
                </button>
              </div>
            </form>
          </div>
          <hr className="h-px bg-gray-200 border-1 dark:bg-gray-700" />
          <div>
            <div className="flex py-2 flex-col items-center space-y-4 md:flex-row md:justify-between md:items-center">
              <h6 className="text-md text-center font-semibold px-2 py-4">User List :</h6>
              <div className="w-full md:w-1/2">
                <label htmlFor="default-search"
                  className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                      fill="none" viewBox="0 0 20 20">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                  </div>
                  <input type="text" className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter name" required onKeyUp={handleChangeSearchName} />
                </div>
              </div>
            </div>
            {Array.isArray(users) ? (
              <div class="relative py-2 overflow-x-auto shadow-md sm:rounded-lg">
                <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-center">
                        No.
                      </th>
                      <th scope="col" class="px-6 py-3 text-center">
                        Name
                      </th>
                      <th scope="col" class="px-6 py-3 text-center">
                        Email
                      </th>
                      <th scope="col" class="px-6 py-3 text-center">
                        Phone
                      </th>
                      <th scope="col" class="px-6 py-3 text-center">
                        Designation
                      </th>
                      <th scope="col" class="px-6 py-3">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {users.map((item, index) => (
                    <tbody>
                      <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <td class="px-6 py-4 text-center">
                          {index + 1}
                        </td>
                        <td class="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap dark:text-white">
                          {item.name}
                        </td>
                        <td class="px-6 py-4 text-center">
                          {item.email}
                        </td>
                        <td class="px-6 py-4 text-center">
                          {item.phoneNumber}
                        </td>
                        {
                          !item.designation ? null : (<td class="px-6 py-4 text-center">
                            {item.designation.name}
                          </td>)
                        }

                        <td class="px-6 py-4 space-x-2 flex items-center">
                          <button onClick={() => handleUpdate(item.id)}>
                            <Image src="/icons/update.png" alt='Update' width={15} height={15} />
                          </button>
                          <button onClick={() => handleDelete(item.id)}>
                            <Image src="/icons/delete.png" alt='Delete' width={15} height={15} />
                          </button>
                          <Link href={`./${item.id}`}>
                            <Image src="/icons/details.png" alt='Details' width={15} height={15} />
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            ) : (
              <div>No users created yet</div>
            )
            }
          </div>
        </div>
      </AdminLayout>
    </>
  )
}