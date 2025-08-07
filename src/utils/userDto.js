import { appendRandomChars } from "./AppendRandomChars.js";

export function userResponse(data) {
    const userType = data.role;
    const response = {
        fullName: data.fullName,
        avatar: data.avatar,
        email: data.email,
        mobileNumber: data.mobileNumber,
        uniqueId: data.uniqueId,
        role: data.role,
        status: data.status,
        dob: data.dob,
        gender: data.gender,
        createdAt: data.createdAt
    }
    if (userType === "ADMIN") {

    } else if (userType === "TEACHER") {
        response.subjects = data.subjects;
        response.qualification = data.qualification;
        response.panCard = data.panCard;
    } else {
        response.batch = data.batch;
        response.course = data.course;
        response.amountDue = data.amountDue;
        response.amountPaid = data.amountPaid;
        response.standard = data.standard;
    }
    return response;
}

export function userRequest(data) {
    const userType = data.role || "STUDENT";
    const uniqueId = appendRandomChars(data.fullName);
    const requestUserReg = {
        address: data.address,
        pincode: data.pincode,
        aadharCard: data.aadharCard,
        panCard: data.panCard,
        uniqueId: uniqueId
    }

    const requestUser = {
        fullName: data.fullName,
        avatar: data.avatar,
        email: data.email,
        mobileNumber: data.mobileNumber,
        password: data.password,
        dob: data.dob,
        role: data.role || "STUDENT",
        gender: data.gender,
        uniqueId: uniqueId,
    }

    if (userType === "ADMIN") {

    } else if (userType === "TEACHER") {
        requestUser.subjects = data.subjects || [];
        requestUser.qualification = data.qualification || "Not Specified";
        requestUser.status = data.status || "INACTIVE";

    } else {
        requestUserReg.fatherName = data.fatherName;
        requestUserReg.motherName = data.motherName;
        requestUserReg.fatherNo = data.fatherNo;
        requestUserReg.motherNo = data.motherNo;

        requestUser.batch = data.batch;
        requestUser.course = data.course;
        requestUser.amountDue = data.amountDue || 0;
        requestUser.amountPaid = data.amountPaid || 0;
        requestUser.standard = data.standard;
        requestUser.status = data.status || "UNPAID";
        requestUser.standard = data.standard || "Not Specified";
    }

    return { requestUser, requestUserReg };
}