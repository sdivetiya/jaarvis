import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Configuration, OpenAIApi } from 'openai';
declare var require: any
@Component({
  selector: 'app-speech-to-text',
  templateUrl: './speech-to-text.component.html',
  styleUrls: ['./speech-to-text.component.css']
})
export class SpeechToTextComponent implements OnInit {
  recognizedText: string = '';
  openAiApiKey = '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';
  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {}
  ngOnInit(): void {
    const Annyang = require('annyang');
    if (Annyang) {
      Annyang.addCallback('result', (userSaid: string[]) => {
        const bestMatch = userSaid[0]; // Get the first result with highest confidence
        this.recognizedText = bestMatch;
        // You can add logic here to process the recognized text.
        console.log(this.recognizedText);
        this.getOpenAIResponse(this.recognizedText);
        this.cdr.detectChanges();
      });

      // Start listening to user speech
      Annyang.start();
    }
  }

  async getOpenAIResponse(text: string) {
    let configuration = new Configuration({apiKey: this.openAiApiKey});
      let openai = new OpenAIApi(configuration);
      let requestData={
        model: 'text-davinci-003',
        prompt: text,
        temperature: 0.95,
        max_tokens: 150,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        stream: false
      };
      let apiResponse =  await openai.createCompletion(requestData);
      console.log(apiResponse);
  }
}