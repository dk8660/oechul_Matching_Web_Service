import StudentInfo from '../models/Student_Info'

export const matching = async (request, response) => {
    try {
        // 친구, 연인
        const friend = await StudentInfo.find({KoM: '친구'})
        // console.log('친구:', friend)
        const couple = await StudentInfo.find({KoM: '연인'})
        // console.log('연인:', couple)

        // 지역
        const regions = 15
        let fF = Array.from(Array(regions), () => new Array()) // 친구 매칭 선택자들을 지역 별로 분류
        let cF = Array.from(Array(regions), () => new Array()) // 연인 매칭 선택자들을 지역 별로 분류
        for(let index = 0; index < friend.length; index++) { // ex) fF[0]은 지역 번호 0번인 강남구 지역 선택자 & 친구 매칭 선택자
            for(let i = 0; i < friend[index].Field.length; i++) {
                for(let j = 0; j < regions; j++) {
                if(j == friend[index].Field[i]) fF[j].push(friend[index])
                }
            }
        }
        // console.log('fF:', fF)

        for(let index = 0; index < couple.length; index++) {
            for(let i = 0; i < couple[index].Field.length; i++) {
                for(let j = 0; j < regions; j++) {
                if(j == couple[index].Field[i]) cF[j].push(couple[index])
                }
            }
        }
        // console.log('cF:', cF)

        // 각자의 선택에 맞춘 후보들 정리
        //친구 매칭
        for(let ind = 0; ind < fF.length; ind++) {
            // 지역별로 본인 MBTI 분류
            let MBTI = Array.from(Array(16), () => new Array())
            for(let inde = 0; inde < fF[ind].length; inde++) {
                for(let i = 0; i < 16; i++) {
                    if(fF[ind][inde].OwnMBTI == i) MBTI[i].push(fF[ind][inde])
                }
            }

            for(let inde = 0; inde < fF[ind].length; inde++) {
                let temp = new Array()
                // 1. 원하는 MBTI를 가진 상대방을 매칭 대상에 추가
                for(let ti = 0; ti < fF[ind][inde].WantedMBTI.length; ti++) {
                    for (let i = 0; i < MBTI[fF[ind][inde].WantedMBTI[ti]].length; i++) {
                        temp.push(MBTI[fF[ind][inde].WantedMBTI[ti]][i])
                    }
                }
                // console.log('f1.', temp)

                // 2. 쌍방 선호 MBTI
                let index = 0;
                let check = true
                for(let ti = 0; ti < temp.length; ti++) {
                    for(let i = 0; i < temp[ti].WantedMBTI.length; i++) {
                        if(fF[ind][inde].OwnMBTI == temp[ti].WantedMBTI[i]) {check = false}
                    }
                    if(check === true) {
                        temp.splice(index, 1)
                        index--
                    }
                    index++
                }
                // console.log('f2.', temp)

                // 3. 같은 학과 매칭 가능 여부 판단
                if(!(fF[ind][inde].SameMajor)) {
                    index = 0
                    for(let ti = 0; ti < temp.length; ti++) {
                        if(fF[ind][inde].Major === temp[ti].Major) {
                            temp.splice(index, 1)
                            index--
                        }
                        index++
                    }
                }
                // console.log('f3.', temp)

                // 4. 군필자만 매칭 가능 여부 판단
                if(fF[ind][inde].O_MilitaryService) {
                    index = 0
                    for(let ti = 0; ti < temp.length; ti++) {
                        if(!(temp[ti].MilitaryService)) {
                            temp.splice(index, 1)
                            index--
                        }
                        index++
                    }
                }
                // console.log('f4.', temp)

                // 5. 흡연자 매칭 가능 여부 판단
                if(!(fF[ind][inde].O_Smoker)) {
                    index = 0
                    for(let ti = 0; ti < temp.length; ti++) {
                        if(temp[ti].Smoker) {
                            temp.splice(index, 1)
                            index--
                        }
                        index++
                    }
                }
                // console.log('f5.', temp)

                // 결과 등록
                const one = await StudentInfo.findOne({STnumber: fF[ind][inde].STnumber})
                let result = one.Matched
                for(let ti = 0; ti < temp.length; ti++) {
                    if(!(one.STnumber == temp[ti].STnumber)) {
                        for(let i = 0; i < one.Matched.length; i++) {
                            if(temp[ti].STnumber != one.Matched[i]) {
                                result.push(Number(temp[ti].STnumber))
                            }
                        } 
                    }
                }
                await StudentInfo.updateOne({STnumber: one.STnumber}, {Matched: result})
            }
        }

        //연인 매칭
        for(let ind = 0; ind < cF.length; ind++) {
            // 지역별로 본인 MBTI 분류
            let MBTI = Array.from(Array(16), () => new Array())
            for(let inde = 0; inde < cF[ind].length; inde++) {
                for(let i = 0; i < 16; i++) {
                    if(cF[ind][inde].OwnMBTI == i) MBTI[i].push(cF[ind][inde])
                }
            }

            for(let inde = 0; inde < cF[ind].length; inde++) {
                let temp = new Array()
                // 1. 원하는 MBTI를 가진 상대방을 매칭 대상에 추가
                for(let ti = 0; ti < cF[ind][inde].WantedMBTI.length; ti++) {
                    for (let i = 0; i < MBTI[cF[ind][inde].WantedMBTI[ti]].length; i++) {
                        temp.push(MBTI[cF[ind][inde].WantedMBTI[ti]][i])
                    }
                }
                // console.log('c1.', temp)

                // 2. 쌍방 선호 MBTI
                let index = 0;
                let check = true
                for(let ti = 0; ti < temp.length; ti++) {
                    for(let i = 0; i < temp[ti].WantedMBTI.length; i++) {
                        if(cF[ind][inde].OwnMBTI == temp[ti].WantedMBTI[i]) {check = false}
                    }
                    if(check === true) {
                        temp.splice(index, 1)
                        index--
                    }
                    index++
                }
                // console.log('c2.', temp)

                // 3. 같은 학과 매칭 가능 여부 판단
                if(!(cF[ind][inde].SameMajor)) {
                    index = 0
                    for(let ti = 0; ti < temp.length; ti++) {
                        if(cF[ind][inde].Major === temp[ti].Major) {
                            temp.splice(index, 1)
                            index--
                        }
                        index++
                    }
                }
                // console.log('c3.', temp)

                // 4. 군필자만 매칭 가능 여부 판단
                if(cF[ind][inde].O_MilitaryService) {
                    index = 0
                    for(let ti = 0; ti < temp.length; ti++) {
                        if(!(temp[ti].MilitaryService)) {
                            temp.splice(index, 1)
                            index--
                        }
                        index++
                    }
                }
                // console.log('c4.', temp)

                // 5. 흡연자 매칭 가능 여부 판단
                if(!(cF[ind][inde].O_Smoker)) {
                    index = 0
                    for(let ti = 0; ti < temp.length; ti++) {
                        if(temp[ti].Smoker) {
                            temp.splice(index, 1)
                            index--
                        }
                        index++
                    }
                }
                // console.log('c5.', temp)

                // 결과 등록
                const one = await StudentInfo.findOne({STnumber: cF[ind][inde].STnumber})
                let result = one.Matched
                for(let ti = 0; ti < temp.length; ti++) {
                    if(!(one.STnumber == temp[ti].STnumber)) {
                        for(let i = 0; i < one.Matched.length; i++) {
                            if(temp[ti].STnumber != one.Matched[i]) {
                                result.push(Number(temp[ti].STnumber))
                            }
                        } 
                    }
                }
                await StudentInfo.updateOne({STnumber: one.STnumber}, {Matched: result})
            }
        }

        return response.render('matching')
    } catch(error) {
        console.log(error)
    }
}