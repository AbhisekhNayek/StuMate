import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Cards } from '../../../Components/Card/Cards'
// eslint-disable-next-line
import firebase from "firebase"
import { useHistory } from 'react-router'



export const AppliedJobs = () => {
let history = useHistory()
    useEffect(() => {
        if (state?.currentUser?.role !== "Student") {
            return history.push("/")
        }
    }, [])
    const [myJobs, setMyJobs] = useState()
    const state = useSelector(state => state)
    let myJob = []
    const allJobs = useSelector(state => state?.allJobs)
    // eslint-disable-next-line
    useEffect(() => {
        if (state && state.currentUser && state.currentUser.Applied_Jobs) {
            // eslint-disable-next-line
            Object.keys(state.currentUser.Applied_Jobs).map((item, index) => {
                myJob.push(item)
                setMyJobs(myJob)
            })
        }
     // eslint-disable-next-line   
    }, [])


    const filteredJobs = allJobs && myJobs && Object.values(allJobs).filter(job => myJobs?.indexOf(String(job?.jobUUID)) !== -1)
    return (
        <div style={{width:"100%",marginTop:"5em"}}>
            <h3 style={{display:"flex",justifyContent:"center", marginBottom:"1.5em",color:"#fff"}}>Applied Jobs here</h3>
            <div style={{ width: "100%", display: "flex", flexWrap:"wrap", justifyContent:"flex-start" }}>

                {filteredJobs?.map((item, index) => {
                    return <Cards key={index} title={item.jobTitle} text={item?.jobDescription} key2="Minimum GPA Required" value2={item?.min_gpa} key3="Tentative Salary" value3={new Intl.NumberFormat('en-PK', { maximumSignificantDigits: 3 }).format(item?.salary)} email={item?.email} key4="Posted By : " value4={item?.postedBy} footerKey="Last date to apply is" footerValue={item?.lastDateToApply} />
                })}

            </div>
        </div>
        )
}
