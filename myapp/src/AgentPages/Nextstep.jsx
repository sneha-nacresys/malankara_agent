import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, FloatingLabel, Button, } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AgentNavbar from '../AgentNavbar/AgentNavbar';
import "./createagent.css";
import "./responsive.css"
import translation from "../pages/translation";
import translationMal from "../pages/translationMal";
//import baseUrl from "../ConstUrl/url";

const Nextstep = () => {
    
  const baseUrl = process.env.REACT_APP_API_URL;
    const [language, setLanguage] = useState("en");
    const handleLanguageChange = (selectedLanguage) => {
        setLanguage(selectedLanguage);
        Cookies.set("language", selectedLanguage);
    };

    const translations = {
        en: translation,
        mal: translationMal,

    };


    useEffect(() => {
        setLanguage(Cookies.get("language") || "en");
    }, [])

    const navigate = useNavigate();
    const [stateId, setStateId] = useState('');
    const [regionId, setRegionId] = useState('');
    const [branchId, setBranchId] = useState('');
    const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
    const [correspondanceaddress, setCorrespondanceAddress] = useState('');
    const [memberName, setMemberName] = useState('');
    const [careOf, setCareOf] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [permanentAddress, setPermanentAddress] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [gender, setGender] = useState('');
    const [maritalStatus, setMaritalStatus] = useState('');
    const [nationality, setNationality] = useState('');
    const [state, setState] = useState('');
    const [emailId, setEmailId] = useState('');
    const [pinCode, setPinCode] = useState('');
    const [city, setCity] = useState('');
    const [password, setPassword] = useState('');
    const [level, setLevel] = useState('');
    const [newstate, setNewstate] = useState('')
    const [newstateid, setNewstateid] = useState('')
    const [newregionid, setNewregionid] = useState('')
    const [newbranchid, setNewbranchid] = useState('')
    const [newregion, setNewregion] = useState('')
    const [newbranch, setNewbranch] = useState('')
    const [showPassword, setShowPassword] = useState(false);
    const [username, setUsername] = useState('')
    const [agentCode, setAgentCode] = useState("");

    const [cbsId, setCbsId] = useState('')
    const [selectedBranch, setSelectedBranch] = useState('');
    // const [selectedZone, setSelectedZone] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedPosition, setSelectedPosition] = useState('');
    const [positionList, setPositionList] = useState([]);

    const handleCheckboxChange = (e) => {
        setIsCheckboxChecked(e.target.checked);
    };

    const [input, setInput] = useState('');
    const [formDisabled, setFormDisabled] = useState(true);
    const [popup, setPopup] = useState(false);
    const [open, setOpen] = useState(false); //snackbar

    const handleInputChange = (e) => {
        const upperCaseValue = e.target.value.toUpperCase();
        setInput(upperCaseValue);
    };



    // useEffect(() => {
    //     const nomineeDetails = Cookies.get('nomineeAdd');
    //     if (nomineeDetails === 'true') {
    //         toast.success(translations[language].nomineedetailsadded);
    //         Cookies.remove('nomineeAdd');
    //     }
    // }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const generatePassword = () => {
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        const numbers = "0123456789";
        let result = '';

        // Generate 4 random alphabets
        for (let i = 0; i < 4; i++) {
            result += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
        }

        // Generate 4 random numbers
        for (let i = 0; i < 4; i++) {
            result += numbers.charAt(Math.floor(Math.random() * numbers.length));
        }

        return result;
    };

    const handleLoadDetails = async (e) => {
        e.preventDefault();

        if (!input) {
            toast.error(translations[language].pleaseprovide);
            return;
        }

        const inputLowerCase = input.toLowerCase();
        const masterUseridLowerCase = Cookies.get('masterUserid').toLowerCase();

        if (inputLowerCase === masterUseridLowerCase) {
            toast.error(translations[language].pleasecheck);
            return;
        }

        const data = {
            mem_id: input,
            userid: Cookies.get('masterUserid')
        };


        try {
            const res = await fetch(`${baseUrl}/agent/agent_create_api/`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const response = await res.json();

            if (response.data) {
                // ==========================our ip=========================

                // const userData = response.data.Member_data;
                // setCbsId(userData.cbs_id );
                // Cookies.set('agentUserid', userData.cbs_id);
                // setPermanentAddress(userData.permanent_address );
                // ==========================malankara=========================
                const userData = response.data;
                setPermanentAddress(userData.permanant_address );
                setCbsId(userData.member_id );
                Cookies.set('agentUserid', userData.member_id);
                // ===================================================

                const stateRegionBranchList = response.state_region_branch;
                setAgentCode(response.username)

                // setUsername(response.username)
                const positionListS = response.Position_list || [];
                setMemberName(userData.membername || 'NA');

                setCorrespondanceAddress(userData.correspondance_address || 'NA');
                setCareOf(Cookies.get('masterUserid'));
                setMaritalStatus(userData.marital_status || 'NA');
                setDateOfBirth(formatDate(userData.dob) || 'NA');

                setMobileNumber(userData.mobile || 'NA');
                setGender(userData.gender || 'NA');
                setNationality(userData.nationality || 'NA');
                setEmailId(userData.email || 'NA');
                setPinCode(userData.pincode || 'NA');
                setCity(userData.city || 'NA');
                const generatedPassword = generatePassword();
                setPassword(generatedPassword);


                // Set the state, region, and branch if available
                if (stateRegionBranchList && stateRegionBranchList.length > 0) {
                    const stateRegionBranch = stateRegionBranchList[0];
                    setNewstate(stateRegionBranch.state_name );
                    setNewregion(stateRegionBranch.region_name );
                    setNewbranch(stateRegionBranch.branch_name );
                    setNewstateid(stateRegionBranch.state_id )
                    setNewregionid(stateRegionBranch.region_id )
                    setNewbranchid(stateRegionBranch.branch_id )
                    const userCode = `MLK${stateRegionBranch.branch_id}${response.username}`; // Use branch_id to construct the userCode
                    setUsername(userCode);

                } else {
                    setNewstate('');
                    setNewregion('');
                    setNewbranch('');
                    setNewstateid('')
                    setNewregionid('')
                    setNewbranchid('')
                }
                setPositionList(positionListS);



                setFormDisabled(false);
                setPopup(false);
            } else if (response.error) {
                toast.error(`MEMBER NOT FOUND ${response.error}`);
                setFormDisabled(true);
                setPopup(true);
                setOpen(true);
            }
        } catch (error) {
            console.error('Error:');
            setFormDisabled(true);
            setPopup(true);
            setOpen(true);
        }
    };


    const [agentCreate, setAgentCreate] = useState(false)


    const handleConfirmClick = async () => {
        if (!selectedPosition) {
            toast.error(translations[language].pleaseSelectPosition)
            return;
        }
        if (!password) {
            toast.error(translations[language].pleasepassword);
            return;
        }
        if (password.length < 8) {
            toast.error(translations[language].passeight);
            return;
        }

        if (password.length > 16) {
            toast.error(translations[language].passsixteen);
            return;
        }

        if (!isCheckboxChecked) {
            toast.error(translations[language].passcheck);
            return;
        } else {
            // if (!selectedBranch || !selectedPosition || !state || !selectedRegion) {
            //     toast.error(translations[language].fields)
            //     return
            // }
            try {
                const data = {
                    cbs_id: cbsId ,
                    username: username ,
                    member_name: memberName ,
                    DateOfBirth: dateOfBirth ,

                    care_of: careOf ,
                    correspondance_address: correspondanceaddress ,
                    permanant_address: permanentAddress ,
                    mobile: mobileNumber ,
                    email: emailId ,
                    gender: gender ,
                    marital_status: maritalStatus ,
                    nationality: nationality ,


                    state: newstateid ,
                    region: newregionid ,


                    branch: newbranchid ,

                    city: city ,
                    pincode: pinCode ,
                    created_by: Cookies.get('masterUserid') || null,
                    password: password,
                    position: selectedPosition,

                    // level: Cookies.get('userLevel') || 'NA',
                    // stateId: stateId, // Include stateId here
                    // branchId: branchId, // Include branchId here
                    // regionId: regionId 
                }
                const res = await fetch(`${baseUrl}/agent/agent_details_add/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
                const response = await res.json();


                if (response.Status === 1) {
                    // toast.error(response.error);
                    const errorData = {
                        error: response.error,
                        member_name: response.member_name,
                        username: response.username
                    };
                    Cookies.set('createAgentBankDet', JSON.stringify(errorData));

                    setTimeout(() => {
                        navigate('/bankdetails');
                    }, 1000);


                }

                else if (response.Status === 3) {
                    // toast.error(response.error);
                    const errorNominee = {
                        error: response.error,
                        member_name: response.member_name,
                        username: response.username
                    };
                    Cookies.set('createAgentNomineeDet', JSON.stringify(errorNominee));

                    setTimeout(() => {
                        navigate('/nomineedetails');
                    }, 1000);
                } else if (response.Status === 4) {
                    toast.error(`${response.username} - ${response.member_name}: ${translations[language].addedempdeatilsalready}`);

                    setCorrespondanceAddress('');
                    setCareOf('');
                    setMaritalStatus('');
                    setMemberName('');
                    setDateOfBirth('');
                    setPermanentAddress('');
                    setMobileNumber('');
                    setGender('');
                    setNationality('');
                    setEmailId('');
                    setPinCode('');
                    setCity('');
                    setCbsId('')
                    setUsername('');
                    setAgentCode('')
                    setPassword('');
                    setSelectedBranch('');
                    setSelectedRegion('');
                    setSelectedPosition('');
                    setIsCheckboxChecked(false);
                    setPositionList([]);
                    setNewstate('');
                    setNewbranch('')
                    setNewregion('')
                    setFormDisabled(true);


                } else if (response.message) {
                    const successData = {
                        message: response.message,
                        member_name: response.member_name,
                        username: response.username
                    };
                    Cookies.set('createAgentSuccess', JSON.stringify(successData));
                    Cookies.set('createAgent', 'true');
                    setAgentCreate(true);
                    setTimeout(() => {
                        navigate('/bankdetails');
                    }, 0);
                } else {
                    Cookies.set('createAgent', 'false');
                    toast.error(translations[language].notcreate);
                }
            } catch (error) {
                console.error("Error adding agent details:", error);
            }

        }
    };



    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };



    return (
        <div>

            <AgentNavbar />

            <ToastContainer autoClose={4000} />
            <Row className="d-flex justify-content-center mx-1">
                <Col lg={11} className="sidenav2">
                    <div className="headingagentinfo">
                        <h6>  {translations[language].newagentregform}</h6>
                    </div>
                </Col>
            </Row>

            <Container>
                <Form onSubmit={handleLoadDetails}>

                    <div className='agent-reg-input-field agent-load-input'>
                        <Form.Control
                       
                            as="input"
                            value={input} // Bind the value to the state
                            className="inputs "
                            placeholder={translations[language].entermscnumber}
                            onChange={handleInputChange} // Trigger the change handler
                        />

                        <button
                            type="submit"
                            style={{
                                width: '200px',
                                border: 'none',
                                background: 'green',
                                color: 'white',
                                borderRadius: '20px',
                                marginLeft: '30px',
                            }}
                        >
                            {translations[language].load}
                        </button>
                    </div>
                    <br />
                </Form>

                <Row className=" d-flex justify-content-center row-create-ba">
                    <Col  lg={6}  className='col-create-ba'>
                        <FloatingLabel controlId="Member Name" label={translations[language].memberId} className="input1 mb-3">
                            <Form.Control
                                type="text"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={cbsId}
                                onChange={(e) => setCbsId(e.target.value)}

                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="Member Name" label={translations[language].membername} className="input1 mb-3">
                            <Form.Control
                                type="text"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={memberName}
                                onChange={(e) => setMemberName(e.target.value)}

                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="Correspondance Address" label={translations[language].correspondanceaddress} className="input1">
                            <Form.Control
                                as="textarea"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={correspondanceaddress}
                                onChange={(e) => setCorrespondanceAddress(e.target.value)}
                            />
                        </FloatingLabel>
                        <br />

                        <FloatingLabel controlId="Date Of Birth" label={translations[language].dateofbirth} className="input1 mb-3">
                            <Form.Control
                                type="input"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={dateOfBirth}
                                onChange={(e) => setDateOfBirth(e.target.value)}

                            />

                        </FloatingLabel>
                        <FloatingLabel controlId="Marital Status" label={translations[language].maritalstatus} className="input1 mb-3">
                            <Form.Control
                                type="input"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={maritalStatus}
                                onChange={(e) => setMaritalStatus(e.target.value)}

                            />
                        </FloatingLabel>


                        <FloatingLabel controlId="Email ID" label={translations[language].emailid} className="input1 mb-3">
                            <Form.Control
                                type="email"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={emailId}
                                onChange={(e) => setEmailId(e.target.value)}

                            />
                        </FloatingLabel>



                        <FloatingLabel controlId="State" label={translations[language].state} className="input1 mb-3">
                            <Form.Control
                                type="email"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={newstate}
                                onChange={(e) => setNewstate(e.target.value)}

                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="State" label="State id" className="input1 mb-3" style={{ display: "none" }}>
                            <Form.Control
                                type="email"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={newstateid}
                                onChange={(e) => setNewstateid(e.target.value)}

                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="Region" label={translations[language].region} className="input1 mb-3">
                            <Form.Control
                                type="text"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={newregion}
                                onChange={(e) => setNewregion(e.target.value)}

                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="Region" label="Region id" className="input1 mb-3" style={{ display: "none" }}>
                            <Form.Control
                                type="email"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={newregionid}
                                onChange={(e) => setNewregionid(e.target.value)}

                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="Branch" label="Branch id" className="input1 mb-3" style={{ display: "none" }}>
                            <Form.Control
                                type="email"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={newbranchid}
                                onChange={(e) => setNewbranchid(e.target.value)}

                            />
                        </FloatingLabel>




                        <FloatingLabel controlId="Branch" label={translations[language].branch} className="input1 mb-3">
                            <Form.Control
                                type="email"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={newbranch}
                                onChange={(e) => setNewbranch(e.target.value)}

                            />
                        </FloatingLabel>




                        <FloatingLabel controlId="UserName" label={translations[language].username} className="input1 mb-3">
                            <Form.Control
                                type="input"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}

                            />
                        </FloatingLabel>


                    </Col>


                    <Col  lg={6}  className='col-create-ba'>


                        <FloatingLabel controlId="Referred by" label={translations[language].refferedby} className="input1 mb-3">
                            <Form.Control
                                type="text"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={careOf}
                                onChange={(e) => setCareOf(e.target.value)}

                            />
                        </FloatingLabel>

                        <FloatingLabel label={translations[language].permanenetaddress} className="input1">
                            <Form.Control
                                as="textarea"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={permanentAddress}
                                onChange={(e) => setPermanentAddress(e.target.value)}

                            />
                        </FloatingLabel>
                        <br />

                        <FloatingLabel controlId="Gender" label={translations[language].gender} className="input1 mb-3">
                            <Form.Control
                                type="input"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}

                            />
                        </FloatingLabel>
                        <FloatingLabel controlId="Mobile Number" label={translations[language].mobilenumber} className="input1 mb-3">
                            <Form.Control
                                type="number"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}

                            />
                        </FloatingLabel>


                        <FloatingLabel controlId="Nationality" label={translations[language].nationality} className="input1 mb-3">
                            <Form.Control
                                type="text"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={nationality}
                                onChange={(e) => setNationality(e.target.value)}

                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="PinCode" label={translations[language].pincode} className="input1 mb-3">
                            <Form.Control
                                type="input"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={pinCode}
                                onChange={(e) => setPinCode(e.target.value)}

                            />
                        </FloatingLabel>

                        <FloatingLabel controlId="City" label={translations[language].city} className="input1 mb-3">
                            <Form.Control
                                type="input"
                                className="inputs"
                                readOnly
                                disabled={formDisabled}
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                            />
                        </FloatingLabel>



                        <FloatingLabel controlId="floatingInput" label={translations[language].password} className="input1 mb-3">
                            <Form.Control
                                // style={{ background: "#E5FFE8", border: ".5px solid #00FF1B " }}
                                type={showPassword ? 'text' : 'password'}
                                className="inputs"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                                maxLength={16}
                                required
                                disabled={formDisabled}
                            />
                            <span
                                className="password-toggle-icon password-eye"
                                // style={{ position: 'absolute', top: '50%', right: '80px', transform: 'translateY(-50%)', cursor: 'pointer' }}
                                onClick={togglePasswordVisibility}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>


                        </FloatingLabel>


                        <FloatingLabel
                            controlId="Designation"
                            label={translations[language].designation}
                            className="mb-3 agent-select"
                        >
                            <Form.Select
                                style={{ background: "#E5FFE8", border: ".5px solid #00FF1B " }}
                                aria-label="Default select example"
                                required
                                className='selectbox-nextstep '
                                value={selectedPosition}
                                onChange={(e) => setSelectedPosition(e.target.value)}
                            >
                                <option>{translations[language].selectposition}</option>
                                {positionList.map((position) => (
                                    <option key={position.id} value={position.id}>
                                        {position.RoleName}
                                    </option>
                                ))}
                            </Form.Select>
                        </FloatingLabel>




                    </Col>

                    <div style={{ display: 'flex' }}>
                        <input type="checkbox" checked={isCheckboxChecked} onChange={handleCheckboxChange} />
                        <label style={{ marginLeft: '10px', color: '#0070c0', fontWeight: 'bold' }}>
                            {translations[language].agree}
                        </label>
                    </div>

                    <div style={{ display: "flex", justifyContent: "center" }} className='mt-2'>
                        <Button style={{ backgroundColor: '#198754', color: '#fff', border: 'none' }} onClick={handleConfirmClick}> {translations[language].confirm}</Button>
                    </div>
                </Row>

            </Container>

        </div>
    );
};

export default Nextstep;