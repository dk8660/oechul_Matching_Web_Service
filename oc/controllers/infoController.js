import StudentInfo from '../models/Student_Info'

export const home = async (request, response) => {
    const infos = await StudentInfo.find({})
    // StudentInfo.find({}, (error, infos) => {
    //   // console.log("errors", error)
    //   // console.log("infos", infos)
    //   response.render('home', {infos})
    // })
    return response.render('home', {infos})
}

export const getinfo = async (request, response) => {
    return response.render("getinfo")
}

export const getinfo_process = async (request, response) => {
    const {STnumber, Name, Field, instagramID, kakaoID, KoM, OwnMBTI, WantedMBTI, Major, MilitaryService, Smoker, Fre_Drinking, Bodyform, Hobby, SameMajor, O_MilitaryService, O_Smoker, O_Fre_Drinking} = request.body
    const info = new StudentInfo({
      _id: Number(STnumber),
      STnumber: STnumber,
      Name: Name,
      Field: Field.split(",").map((word) => `${word}`),
      instagramID: instagramID,
      kakaoID: kakaoID,
      KoM: KoM,
      OwnMBTI: OwnMBTI,
      WantedMBTI: WantedMBTI.split(",").map((word) => `${word}`),
      Major: Major,
      MilitaryService: MilitaryService,
      Smoker: Smoker,
      Fre_Drinking: Fre_Drinking,
      Bodyform: Bodyform,
      Hobby: Hobby,
      SameMajor: SameMajor,
      O_MilitaryService: O_MilitaryService,
      O_Smoker: O_Smoker,
      O_Fre_Drinking: O_Fre_Drinking,
    })
    await info.save()
    return response.redirect(`/`)
}

export const Delete = async (request, response) => {
    return response.render("delete")
}

export const delete_process = async (request, response) => {
    const {STnumber} = request.body
    await StudentInfo.deleteOne({STnumber: STnumber}, (err) => {
        if(err) console.log(err)
    })
    return response.redirect(`/`)
}

export const update = async (request, response) => {
    return response.render("update")
}

export const update_process = async (request, response) => {
    const {STnumber} = request.body
    await StudentInfo.findById(Number(STnumber), (error, info) => {
      if(!info) return response.render("404")
      return response.render('edit', {info})
    })
}

export const edit_process = async (request, response) => {
    const {STnumber, Name, Field, instagramID, kakaoID, KoM, OwnMBTI, WantedMBTI, Major, MilitaryService, Smoker, Fre_Drinking, Bodyform, Hobby, SameMajor, O_MilitaryService, O_Smoker, O_Fre_Drinking, Matched, isMatched} = request.body
    await StudentInfo.findById(Number(STnumber), (error, info) => {
      info._id = Number(STnumber),
      info.STnumber = STnumber,
      info.Name = Name,
      info.Field = Field.split(",").map((word) => `${word}`),
      info.instagramID = instagramID,
      info.kakaoID = kakaoID,
      info.KoM = KoM,
      info.OwnMBTI = OwnMBTI,
      info.WantedMBTI = WantedMBTI.split(",").map((word) => `${word}`),
      info.Major = Major,
      info.MilitaryService = MilitaryService,
      info.Smoker = Smoker,
      info.Fre_Drinking = Fre_Drinking,
      info.Bodyform = Bodyform,
      info.Hobby = Hobby,
      info.SameMajor = SameMajor,
      info.O_MilitaryService = O_MilitaryService,
      info.O_Smoker = O_Smoker,
      info.O_Fre_Drinking = O_Fre_Drinking,
      info.Matched = Matched,
      info.isMatched = isMatched
  
      info.save()
    })
     return response.redirect(`/`)
}

export const watch = async (request, response) => {
    const STnumber = request.url.slice(6)
    await StudentInfo.findById(Number(STnumber), (error, info) => {
      return response.render("detail", {info})
    })
}