import { createContext, useContext, useState } from "react";

const EventsContext = createContext({
    eventListItems:[],
    addEvent:(element) => {},
});

export default function Store({children}){
    const [ eventListItems, setEventList ] = useState([]);

    function addEvent(element){
        // const list = [...eventListItems];
        // list.push(element)
        setEventList(element)
    }

    return (
        <EventsContext.Provider
            value={{
                eventListItems,
                addEvent,
            }}
        >
            {children}
        </EventsContext.Provider>
    )
};

export function useEventsContext() {
    return useContext(EventsContext)
}