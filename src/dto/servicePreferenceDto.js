class ServicePreferenceDto {
  constructor(servicePreference) {
    this.id = servicePreference.id;
    this.type = servicePreference.preference;
  }
}

module.exports = ServicePreferenceDto;
