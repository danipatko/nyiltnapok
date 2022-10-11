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
	/**
	 * After this date, registering and applying will be enabled
	 */
	startDate: Date;
}

// change your default settings here
const settings: Settings = {
	appointments: [
		{ label: '2022. október 25. 13:30 - 16:30' },
		{ label: '2022. október 26. 13:30 - 16:30' },
		{ label: '2022. október 27. 13:30 - 16:30' }
	],
	appointmentCooldown: 1,
	groupCount: 8,
	groupMemberCount: 25,
	otpValidFor: 120,
	otpCodeLength: 8,
	startDate: new Date('2022-10-12T12:00:00'),
	deadline: new Date('2022-10-24T23:59:59')
};

export default settings;
export type { Settings };
