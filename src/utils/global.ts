
const statusColor = (status:string)=>{
    switch(status){
      case "PENDING":
        return "bg-red-50"
      case "ACTIVE":
        return "bg-green-50"
      case "INACTIVE":
        return "bg-blue-50"
      default:
        return ""
    }
  }

  export {statusColor}