from transformers import AutoTokenizer, AutoModelForMaskedLM, FillMaskPipeline
tokenizer = AutoTokenizer.from_pretrained("klue/roberta-large")
model = AutoModelForMaskedLM.from_pretrained("klue/roberta-large")
pip = FillMaskPipeline(model=model, tokenizer=tokenizer, top_k=15)

def get_next_words(text):
    res = pip(text)
    arr = []
    for i in res:
        arr += [i['token_str']]
    for i in ['[PAD]', '[UNK]', '[CLS]', '[SEP]', ['MASK']]:
        try:
            arr.remove(i)
        except:
            pass

    return arr

