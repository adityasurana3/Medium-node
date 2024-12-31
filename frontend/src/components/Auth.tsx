import { Link } from "react-router-dom"

export const Auth = () => {
    return (
        <div className="h-screen flex justify-center flex-col">
            <div className="flex justify-center">
                <div>
                    <div className="text-3xl font-extrabold">
                        Create an Account
                    </div>
                    <div className="text-slate-400">
                        Already have an Account? <Link className="pl-2 underline" to='/signin'>Signin</Link>
                    </div>
                    <LabelledInput placeholder={'Enter your email'}/>
                </div>
            </div>
        </div>
    )
}

interface LabelledInputTypes {
    placeholder: string
}

function LabelledInput({placeholder}: LabelledInputTypes) {
    return (
        <form>
            <label className="block">
                <span className="block text-sm font-medium text-slate-700">Username</span>
                <input type="text" placeholder={placeholder}  className="mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400
      focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none
      invalid:border-pink-500 invalid:text-pink-600 focus:invalid:border-pink-500 focus:invalid:ring-pink-500"/>
            </label>
        </form>
    )

}