import { CheckCircle } from 'lucide-react'
import React from 'react'

type ConfirmProps = {
  userEmail: string
}

function Confirm({ userEmail }: ConfirmProps) {
  return (
   <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          धन्यवाद! Booking Confirmed
        </h2>
        <p className="text-gray-600 mb-4">
          Your tickets have been successfully booked!
        </p>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
          <p className="font-semibold text-green-800">
            Confirmation sent to:
          </p>
          <p className="text-green-700">{userEmail}</p>
        </div>
      </div>
    </div>
  )
}

export default Confirm
