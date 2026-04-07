import env from '../config/env.js'

import * as UserModelMemory from './user.model.js'
import * as AppointmentModelMemory from './appointment.model.js'
import * as MedicalReportModelMemory from './medicalReport.model.js'
import * as DiagnosisModelMemory from './diagnosis.model.js'
import * as PrescriptionModelMemory from './prescription.model.js'
import * as MedicalRecordModelMemory from './medicalRecord.model.js'

import * as UserModelMongoose from './mongoose/user.model.js'
import * as AppointmentModelMongoose from './mongoose/appointment.model.js'
import * as MedicalReportModelMongoose from './mongoose/medicalReport.model.js'
import * as DiagnosisModelMongoose from './mongoose/diagnosis.model.js'
import * as PrescriptionModelMongoose from './mongoose/prescription.model.js'
import * as MedicalRecordModelMongoose from './mongoose/medicalRecord.model.js'

export const UserModel = env.DB_ADAPTER === 'mongoose' ? UserModelMongoose : UserModelMemory
export const AppointmentModel = env.DB_ADAPTER === 'mongoose' ? AppointmentModelMongoose : AppointmentModelMemory
export const MedicalReportModel =
  env.DB_ADAPTER === 'mongoose' ? MedicalReportModelMongoose : MedicalReportModelMemory
export const DiagnosisModel = env.DB_ADAPTER === 'mongoose' ? DiagnosisModelMongoose : DiagnosisModelMemory
export const PrescriptionModel =
  env.DB_ADAPTER === 'mongoose' ? PrescriptionModelMongoose : PrescriptionModelMemory
export const MedicalRecordModel =
  env.DB_ADAPTER === 'mongoose' ? MedicalRecordModelMongoose : MedicalRecordModelMemory

