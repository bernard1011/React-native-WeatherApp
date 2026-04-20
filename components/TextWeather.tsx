import { View, Text, Button } from "react-native";
import { useState } from "react";

type CatNames = {
    name: string;
}

type CatsStatus = 'very hungry' | 'normal' | 'full'

const Cat = (props: CatNames) => {
    const [isFull, setToFull] = useState<number>(0);
    const [feded, setFed] = useState<CatsStatus>('very hungry')
   
    const fedCat = () => {
        if (isFull < 6) {
            setToFull(prev=>prev+1)
            console.log(isFull)
            setFed('normal')
        } else {
            setFed('full')
        }
    }

    return (
        <>
            <Text>
                Hello, my name is {props.name}. I am a cat and I am {feded}
            </Text>
            <Button onPress={()=>fedCat()} disabled={feded==='full'} title={feded === 'full' ? "Let me some food, please" : "Thanks!"}/>    
        </>
    )
}

export default Cat;