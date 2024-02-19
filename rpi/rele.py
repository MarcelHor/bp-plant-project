import RPi.GPIO as GPIO
import time

class RelayControl:
    def __init__(self, pin):
        self.pin = pin
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(self.pin, GPIO.OUT)

    def turn_on(self):
        GPIO.output(self.pin, GPIO.HIGH)

    def turn_off(self):
        GPIO.output(self.pin, GPIO.LOW)

    def turn_on_for(self, seconds):
        self.turn_on()
        time.sleep(seconds)
        self.turn_off()

    def is_on(self):
        return GPIO.input(self.pin) == GPIO.HIGH

    @staticmethod
    def cleanup():
        GPIO.cleanup()
