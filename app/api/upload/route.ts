import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { generateCode } from "@/utils/generate-code";

// interface RequestBodyType {
//     key: string,
//     text: string,
//     epiry: number,
// }


export async function POST(request: NextRequest) {
    try {

        const body = await request.json();

        const { text } = body;

        if (!text) {
            return NextResponse.json({
                error: "Text is Required"
            }, { status: 400 })
        }


        console.log("Text Recieved : ", text)

        const code = generateCode();

        await redis.set(code, text, { ex: 300 });

        // const REQUEST_BODY: RequestBodyType = {
        //     key: code,
        //     text: text,
        //     epiry: 300
        // }

        return NextResponse.json({
            code: code
        });


    } catch (error) {
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }

}