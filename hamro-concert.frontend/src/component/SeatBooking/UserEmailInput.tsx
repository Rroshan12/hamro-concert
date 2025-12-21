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
    <div className="space-y-4">
      <h3 className="text-lg font-bold theme-text-primary">Your Information</h3>
      <div>
        <label className="block text-sm font-medium theme-text-secondary mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          placeholder="Enter your name"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium theme-text-secondary mb-2">
          Email Address
        </label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
          placeholder="your.email@example.com"
          required
        />
      </div>
    </div>
  )
}

export default UserEmailInput
