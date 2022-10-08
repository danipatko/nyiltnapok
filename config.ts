interface Settings {
	/**
	 * Possible choices after user login
	 */
	appointments: { label: string }[];
	/**
	 * Number of hours a user has to wait before changing appointments
	 */
	appointmentCooldown: number;
	/**
	 * How many groups are in a single appointment
	 */
	groupCount: number;
	/**
	 * How many people can be in a single group
	 */
	groupMemberCount: number;
	/**
	 * Validity time of one time passwords in seconds
	 */
	otpValidFor: number;
	/**
	 * How many digits does the user have to enter
	 */
	otpCodeLength: number;
	/**
	 * After this date, registering and applying will be disabled
	 */
	deadline: Date;
}

// change your default settings here
const settings: Settings = {
	appointments: [{ label: '2022. október 25. 14:20' }, { label: '2022. október 26. 14:20' }, { label: '2022. október 27. 14:20' }],
	appointmentCooldown: 1,
	groupCount: 8,
	groupMemberCount: 20,
	otpValidFor: 120,
	otpCodeLength: 8,
	deadline: new Date('2022-10-24T23:59:59')
};

export default settings;
export type { Settings };
