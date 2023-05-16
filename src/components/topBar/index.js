

export default function TopBar() {

  return (
    <div className="topbar">
      <h3 style={{ color: "white", fontWeight: 600, marginLeft: 40 }}>Build your home</h3>


      <div 
        className="userInfo"
        style={{ cursor: "pointer"}}
      >
        <div style={{ background: "white", width: "30px", height: "30px", borderRadius: "50%", marginRight: 10 }}/>
        <h4 style={{ color: "white", fontWeight: 400 }}>Teemu Väyrynen</h4>
      </div>
    </div>
  )
}