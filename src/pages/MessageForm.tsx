import { useState } from "react"
import { Imessage } from "../Interfaces/Imessage"
import { useAlert } from "../actions/useAlert"
import { useMessage } from "../actions/useMessage"
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

export default function MessageForm() {
    const [messages, setMessages] = useState<Imessage[]>([])
    const {
            schema
        } = useMessage()
    const {
            showSwal
        } = useAlert();
    const {
            register,
            handleSubmit,
            reset,
            setValue,
            getValues,
            formState :{errors},
            watch,
        } = useForm<Imessage>({
            mode: 'onChange', 
            resolver :yupResolver(schema)
        });
    const submitForm = (data: Imessage) => {
        const newMessage = {
            id: Date.now(),
            userName: getValues().userName,
            text: getValues().text,
        }
        setMessages([...messages, newMessage]);
        reset()
        showSwal('Message send', 'success');
    }
   
    return (
        <>
            <div style={{display:"flex", justifyContent:"center", width: "1500px", margin: "0 auto"}}>
                <div style={{width:"50%", marginLeft: "100px", marginTop: "100px", fontSize: "20px"}}>
                    <form action="" onSubmit={ handleSubmit(submitForm) } >
                        <div>
                            <div style={{marginBottom: "15px", display:"grid"}}>
                                <label  htmlFor="name" style={{margin:"1rem"}}>Username </label>
                                <input {...register('userName')} 
                                    type="text" style={{width: "500px", height: "25px", borderRadius: "15px", fontSize: "16px", borderColor: "red"}}
                                    id="userName"
                                    //value={getValues().userName}
                                    //onChange={(event) => setValue('userName', event.target.value)}
                                />
                            </div>   
                            <div style={{marginBottom: "15px", display:"grid"}}>
                                <label htmlFor="message" style={{margin:"1rem"}}>Message</label>
                                <input {...register('text')} 
                                    type="text" style={{width: "500px", height: "25px", borderRadius: "15px", fontSize: "16px", borderColor: "red"}}
                                    id="message"
                                    //value={getValues().text}
                                    //onChange={(event) => setValue('text', event.target.value)}
                                />
                            </div>     
                        </div>
                        <button style={{width: "300px", alignContent: "center", marginLeft: "100px", height: "25px", borderRadius: "15px", fontSize: "16px", borderColor: "blue"}}
                            type="submit">
                            Send
                        </button>
                    </form>
                </div>    
                <div style={{width:"50%", marginTop: "100px", fontSize: "20px"}}>
                    
                    <ul>
                        <p>Messages: </p>
                    {messages.map((message) => (
                        <li key={message.id} style={{marginLeft: "25px", fontSize: "18px", border: "1px solid green", borderRadius: "15px",
                            marginBottom: "8px", paddingLeft: "8px", height: "30px"
                        }}>
                            <strong>{message.userName}: </strong>{message.text}
                        </li>
                    ))} 
                    </ul>
                </div>
            </div>
      </>          
    )
}