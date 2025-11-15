function Message(props){
    return(
        <>
        <div className="flex text-xs text-left mt-[30px] mb-[10px] justify-evenly">
          <div><p className="grow-1 shrink-0">{props.type}</p></div>
          <div><p className="grow-1 shrink-0">{props.location}</p></div>
          <div><p className="grow-1 shrink-0">{props.sender}</p></div>
          <div><p className="grow-1 shrink-0">{props.status}</p></div>
        </div>
        <hr/>
        </>
    )
}

export default Message