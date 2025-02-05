import { Outlet, Link } from "react-router-dom"
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from "./authApiSlice"
import usePersist from "../../hooks/usePersist"
import { useSelector } from 'react-redux'
import { selectCurrentToken } from "./authSlice"
import PulseLoader from 'react-spinners/PulseLoader'

const PersistLogin = () => {
    const [persist] = usePersist()
    const token = useSelector(selectCurrentToken)
    const effectRan = useRef(false)

    const [trueSuccess, setTrueSuccess] = useState(false)

    const [refresh, {
        isUninitialized,
        isLoading,
        isSuccess,
        isError,
        error
    }] = useRefreshMutation()

    useEffect(() => {
        // React 18 Strict Mode
        if (effectRan.current === true || import.meta.env.MODE !== 'development') {
            const verifyRefreshToken = async () => {
                console.log('verifying refresh token')
                try {
                    const response = await refresh().unwrap()
                    console.log('Refresh successful:', response)
                    setTrueSuccess(true)
                }
                catch (err) {
                    console.error('Failed to refresh token:', err)
                }
            }

            // Only try to refresh if we don't have a token and persistence is enabled
            if (!token && persist) {
                console.log('No token found, attempting refresh')
                verifyRefreshToken()
            }
        }

        return () => effectRan.current = true

        // eslint-disable-next-line
    }, [])

    let content
    if (!persist) {
        console.log('No persistence')
        content = <Outlet />
    } else if (isLoading) {
        console.log('Loading')
        content = (
            <div className="flex justify-center items-center h-screen bg-primary">
                <PulseLoader color={"#FFF"} />
            </div>
        )
    } 
    else if (isError) {
        console.log('Error:', error)
        content = (
            <div className="flex justify-center items-center h-screen bg-primary">
                <p className='text-red-500 text-center'>
                    {`${error?.data?.message || 'Error refreshing access token'} - `}
                    <Link to="/auth/loginUser" className="text-red-400 hover:text-red-300">
                        Please login again
                    </Link>
                </p>
            </div>
        )
    } 
    else if (isSuccess && trueSuccess) {
        console.log('Success - token refreshed')
        content = <Outlet />
    } else if (token && isUninitialized) {
        console.log('Token exists, no initialization needed')
        content = <Outlet />
    }

    return content
}

export default PersistLogin 