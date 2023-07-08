import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const email = process.env.EMAIL
const pass = process.env.PASSWORD

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email,
        pass: pass
    }
})

const mailOptions = {
    from: email,
    to: email
}

type dataType = {
    email: string,
    message: string
}

type ContactMessageFields = {
    [key: string]: string;
}

const contact_message_fields : ContactMessageFields = {
    'email': "Email",
    'message': "Message"
}

const generateEmail = (data: any) => {
    
    const stringData = Object.entries(data).reduce((str, [key, value]) => {
        return str  + `${contact_message_fields[key]} :\n${value}\n\n`;
    }, "")

    const htmlData = Object.entries(data).reduce((str, [key, value]) => {
        return str + `<h3>${contact_message_fields[key]} :</h3>\n<p>${value}</p>\n\n`;
    }, "")
    
    return ({text:stringData, html:htmlData});
}

export async function POST(req: Request){
    if(req.method === 'POST') {
        const data: dataType = await req.json();
        console.log("SERVERR", data);

        if (!data.email || !data.message) {
            return NextResponse.json({ message: "Bad Request"}, {status: 400});
        }

        try {
            await transporter.sendMail({
                ...mailOptions,
                ...generateEmail(data),
                'subject': "TaskTide Contact Form"
            })

             return NextResponse.json({ message: "Success"}, {status: 200});
        } catch (error: any) {
            console.log(error)
            return NextResponse.json({ message: "Bad Request"}, {status: 400});
        }
    }

    return NextResponse.json({ message: "Bad Request"}, {status: 400});
}
