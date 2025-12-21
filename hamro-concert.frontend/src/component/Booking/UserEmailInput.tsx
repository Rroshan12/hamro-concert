import React from 'react'

type UserEmailInputProps = {
  userName: string
  setUserName: React.Dispatch<React.SetStateAction<string>>
  userEmail: string
  setUserEmail: React.Dispatch<React.SetStateAction<string>>
}


function UserEmailInput({
  userName,
  setUserName,
  userEmail,
  setUserEmail,
}: UserEmailInputProps) {
  return (
    <div className="mb-6 space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none"
          placeholder="your.email@example.com"
          required
        />
      </div>
    </div>
  )
}

export default UserEmailInput
