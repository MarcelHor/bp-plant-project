from grove.adc import ADC


class GroveMoistureSensor:
    def __init__(self, channel, min_value=590, max_value=330):
        self.min_value = min_value
        self.max_value = max_value
        self.channel = channel
        self.adc = ADC()

    def readRaw(self):
        return self.adc.read(self.channel)

    def read(self):
        value = self.adc.read(self.channel)
        percentage = ((self.min_value - value) / (self.min_value - self.max_value)) * 100
        return max(0, min(100, percentage))


class GroveWaterSensor:
    def __init__(self, channel, wet_threshold=20):
        self.wet_threshold = wet_threshold
        self.channel = channel
        self.adc = ADC()

    def readRaw(self):
        return self.adc.read(self.channel)

    def read(self):
        value = self.adc.read(self.channel)
        print(value)
        if value <= self.wet_threshold:
            return 100
        else:
            return 0


class LightSensor:
    def __init__(self, channel, max_light_value=702):
        self.max_light_value = max_light_value
        self.channel = channel
        self.adc = ADC()

    def readRaw(self):
        return self.adc.read(self.channel)

    def read(self):
        raw_value = self.adc.read(self.channel)
        percentage = (raw_value / self.max_light_value) * 100
        return max(0, min(100, percentage))
